                                                                                      -- Phase 2: Content Gallery Schema Updates
                                                                                      -- Add preview reveals tracking and comments system

                                                                                      -- Update content table to include preview tracking
                                                                                      ALTER TABLE content ADD COLUMN IF NOT EXISTS preview_duration INTEGER DEFAULT 6; -- 6 seconds preview
                                                                                      ALTER TABLE content ADD COLUMN IF NOT EXISTS has_preview BOOLEAN DEFAULT false;
                                                                                      ALTER TABLE content ADD COLUMN IF NOT EXISTS preview_url TEXT;

                                                                                      -- Create preview_views table to track daily preview limits
                                                                                      CREATE TABLE IF NOT EXISTS preview_views (
                                                                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                                                                        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                                                                                        content_id UUID REFERENCES content(id) ON DELETE CASCADE,
                                                                                        viewed_at TIMESTAMPTZ DEFAULT NOW(),
                                                                                        created_at TIMESTAMPTZ DEFAULT NOW()
                                                                                      );

                                                                                      CREATE INDEX idx_preview_views_user ON preview_views(user_id);
                                                                                      CREATE INDEX idx_preview_views_content ON preview_views(content_id);
                                                                                      CREATE INDEX idx_preview_views_date ON preview_views(viewed_at);

                                                                                      -- Create comments table
                                                                                      CREATE TABLE IF NOT EXISTS comments (
                                                                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                                                                        content_id UUID REFERENCES content(id) ON DELETE CASCADE,
                                                                                        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                                                                                        parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
                                                                                        comment_text TEXT NOT NULL,
                                                                                        is_edited BOOLEAN DEFAULT false,
                                                                                        is_deleted BOOLEAN DEFAULT false,
                                                                                        is_flagged BOOLEAN DEFAULT false,
                                                                                        flag_reason TEXT,
                                                                                        like_count INTEGER DEFAULT 0,
                                                                                        created_at TIMESTAMPTZ DEFAULT NOW(),
                                                                                        updated_at TIMESTAMPTZ DEFAULT NOW()
                                                                                      );

                                                                                      CREATE INDEX idx_comments_content ON comments(content_id);
                                                                                      CREATE INDEX idx_comments_user ON comments(user_id);
                                                                                      CREATE INDEX idx_comments_parent ON comments(parent_id);
                                                                                      CREATE INDEX idx_comments_created ON comments(created_at DESC);

                                                                                      -- Create comment_likes table
                                                                                      CREATE TABLE IF NOT EXISTS comment_likes (
                                                                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                                                                        comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
                                                                                        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                                                                                        created_at TIMESTAMPTZ DEFAULT NOW(),
                                                                                        UNIQUE(comment_id, user_id)
                                                                                      );

                                                                                      CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
                                                                                      CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);

                                                                                      -- Create saved_videos table (Hxmp Stash)
                                                                                      CREATE TABLE IF NOT EXISTS saved_videos (
                                                                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                                                                        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                                                                                        content_id UUID REFERENCES content(id) ON DELETE CASCADE,
                                                                                        playlist_name TEXT DEFAULT 'My Stash',
                                                                                        notes TEXT,
                                                                                        created_at TIMESTAMPTZ DEFAULT NOW(),
                                                                                        UNIQUE(user_id, content_id)
                                                                                      );

                                                                                      CREATE INDEX idx_saved_videos_user ON saved_videos(user_id);
                                                                                      CREATE INDEX idx_saved_videos_content ON saved_videos(content_id);
                                                                                      CREATE INDEX idx_saved_videos_created ON saved_videos(created_at DESC);

                                                                                      -- Create categories table
                                                                                      CREATE TABLE IF NOT EXISTS categories (
                                                                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                                                                        name TEXT UNIQUE NOT NULL,
                                                                                        slug TEXT UNIQUE NOT NULL,
                                                                                        description TEXT,
                                                                                        icon_svg TEXT,
                                                                                        order_index INTEGER DEFAULT 0,
                                                                                        is_active BOOLEAN DEFAULT true,
                                                                                        created_at TIMESTAMPTZ DEFAULT NOW()
                                                                                      );

                                                                                      CREATE INDEX idx_categories_slug ON categories(slug);
                                                                                      CREATE INDEX idx_categories_order ON categories(order_index);

                                                                                      -- Insert default categories
                                                                                      INSERT INTO categories (name, slug, description, icon_svg, order_index) VALUES
                                                                                      ('Xrcakey Vault', 'xrcakey-vault', 'Premium locked content', '<svg>...</svg>', 1),
                                                                                      ('Bubble Butts', 'bubble-butts', 'Bubble butt content', '<svg>...</svg>', 2),
                                                                                      ('All Content', 'all', 'Browse all videos', NULL, 0)
                                                                                      ON CONFLICT (slug) DO NOTHING;

                                                                                      -- RLS Policies for new tables

                                                                                      -- Preview Views Policies
                                                                                      ALTER TABLE preview_views ENABLE ROW LEVEL SECURITY;

                                                                                      CREATE POLICY "Users can view their own preview history"
                                                                                        ON preview_views FOR SELECT
                                                                                        USING (auth.uid() = user_id);

                                                                                      CREATE POLICY "Users can insert their own preview views"
                                                                                        ON preview_views FOR INSERT
                                                                                        WITH CHECK (auth.uid() = user_id);

                                                                                      -- Comments Policies
                                                                                      ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

                                                                                      CREATE POLICY "Anyone can view non-deleted comments"
                                                                                        ON comments FOR SELECT
                                                                                        USING (is_deleted = false);

                                                                                      CREATE POLICY "Authenticated users can create comments"
                                                                                        ON comments FOR INSERT
                                                                                        WITH CHECK (auth.uid() = user_id);

                                                                                      CREATE POLICY "Users can update their own comments"
                                                                                        ON comments FOR UPDATE
                                                                                        USING (auth.uid() = user_id);

                                                                                      CREATE POLICY "Users can delete their own comments"
                                                                                        ON comments FOR DELETE
                                                                                        USING (auth.uid() = user_id);

                                                                                      -- Comment Likes Policies
                                                                                      ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

                                                                                      CREATE POLICY "Anyone can view comment likes"
                                                                                        ON comment_likes FOR SELECT
                                                                                        USING (true);

                                                                                      CREATE POLICY "Authenticated users can like comments"
                                                                                        ON comment_likes FOR INSERT
                                                                                        WITH CHECK (auth.uid() = user_id);

                                                                                      CREATE POLICY "Users can unlike comments"
                                                                                        ON comment_likes FOR DELETE
                                                                                        USING (auth.uid() = user_id);

                                                                                      -- Saved Videos Policies
                                                                                      ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;

                                                                                      CREATE POLICY "Users can view their own saved videos"
                                                                                        ON saved_videos FOR SELECT
                                                                                        USING (auth.uid() = user_id);

                                                                                      CREATE POLICY "Users can save videos"
                                                                                        ON saved_videos FOR INSERT
                                                                                        WITH CHECK (auth.uid() = user_id);

                                                                                      CREATE POLICY "Users can remove saved videos"
                                                                                        ON saved_videos FOR DELETE
                                                                                        USING (auth.uid() = user_id);

                                                                                      -- Categories Policies
                                                                                      ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

                                                                                      CREATE POLICY "Anyone can view active categories"
                                                                                        ON categories FOR SELECT
                                                                                        USING (is_active = true);

                                                                                      -- Functions

                                                                                      -- Function to check daily preview limit (2 previews per video per day)
                                                                                      CREATE OR REPLACE FUNCTION check_preview_limit(p_user_id UUID, p_content_id UUID)
                                                                                      RETURNS BOOLEAN AS $$
                                                                                      DECLARE
                                                                                        preview_count INTEGER;
                                                                                      BEGIN
                                                                                        SELECT COUNT(*) INTO preview_count
                                                                                        FROM preview_views
                                                                                        WHERE user_id = p_user_id
                                                                                          AND content_id = p_content_id
                                                                                          AND viewed_at >= CURRENT_DATE;
                                                                                        
                                                                                        RETURN preview_count < 2;
                                                                                      END;
                                                                                      $$ LANGUAGE plpgsql SECURITY DEFINER;

                                                                                      -- Function to increment comment like count
                                                                                      CREATE OR REPLACE FUNCTION increment_comment_likes()
                                                                                      RETURNS TRIGGER AS $$
                                                                                      BEGIN
                                                                                        UPDATE comments
                                                                                        SET like_count = like_count + 1
                                                                                        WHERE id = NEW.comment_id;
                                                                                        RETURN NEW;
                                                                                      END;
                                                                                      $$ LANGUAGE plpgsql;

                                                                                      CREATE TRIGGER trigger_increment_comment_likes
                                                                                        AFTER INSERT ON comment_likes
                                                                                        FOR EACH ROW
                                                                                        EXECUTE FUNCTION increment_comment_likes();

                                                                                      -- Function to decrement comment like count
                                                                                      CREATE OR REPLACE FUNCTION decrement_comment_likes()
                                                                                      RETURNS TRIGGER AS $$
                                                                                      BEGIN
                                                                                        UPDATE comments
                                                                                        SET like_count = like_count - 1
                                                                                        WHERE id = OLD.comment_id;
                                                                                        RETURN OLD;
                                                                                      END;
                                                                                      $$ LANGUAGE plpgsql;

                                                                                      CREATE TRIGGER trigger_decrement_comment_likes
                                                                                        AFTER DELETE ON comment_likes
                                                                                        FOR EACH ROW
                                                                                        EXECUTE FUNCTION decrement_comment_likes();

                                                                                      -- Function to update comment count on content
                                                                                      CREATE OR REPLACE FUNCTION update_content_comment_count()
                                                                                      RETURNS TRIGGER AS $$
                                                                                      BEGIN
                                                                                        IF TG_OP = 'INSERT' THEN
                                                                                          UPDATE content
                                                                                          SET comment_count = comment_count + 1
                                                                                          WHERE id = NEW.content_id;
                                                                                        ELSIF TG_OP = 'DELETE' THEN
                                                                                          UPDATE content
                                                                                          SET comment_count = comment_count - 1
                                                                                          WHERE id = OLD.content_id;
                                                                                        END IF;
                                                                                        RETURN NULL;
                                                                                      END;
                                                                                      $$ LANGUAGE plpgsql;

                                                                                      CREATE TRIGGER trigger_update_comment_count
                                                                                        AFTER INSERT OR DELETE ON comments
                                                                                        FOR EACH ROW
                                                                                        EXECUTE FUNCTION update_content_comment_count();
