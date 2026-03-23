-- Phase 6 (Fix): Grant Authenticated Users Insert/Select permissions on entirely newly created Buckets.

-- 1. Allow public read access to all files inside 'raw_resumes' (Since the bucket is marked public)
CREATE POLICY "Public Read Access to raw_resumes"
ON storage.objects FOR SELECT
USING ( bucket_id = 'raw_resumes' );

-- 2. Allow authenticated users to upload new files into 'raw_resumes', 
-- ensuring they can only upload into a folder named with their own User ID.
CREATE POLICY "Authenticated users can upload to raw_resumes"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'raw_resumes' 
    AND auth.role() = 'authenticated'
    AND (auth.uid()::text = (string_to_array(name, '/'))[1])
);

-- 3. Allow authenticated users to update/overwrite files they own
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
WITH CHECK (
    bucket_id = 'raw_resumes' 
    AND auth.role() = 'authenticated'
    AND (auth.uid()::text = (string_to_array(name, '/'))[1])
);

-- 4. Allow authenticated users to delete files they own
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'raw_resumes' 
    AND auth.role() = 'authenticated'
    AND (auth.uid()::text = (string_to_array(name, '/'))[1])
);
