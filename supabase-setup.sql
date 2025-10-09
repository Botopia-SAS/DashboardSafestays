-- ============================================
-- SafeStays - Database Setup Script
-- ============================================

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    area NUMERIC(10, 2),
    location TEXT NOT NULL,
    listing_type TEXT NOT NULL,
    property_type TEXT NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    agency_fee NUMERIC(10, 2) DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to properties"
ON properties
FOR SELECT
TO public
USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert properties"
ON properties
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update properties"
ON properties
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete properties"
ON properties
FOR DELETE
TO authenticated
USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);

-- ============================================
-- Optional: Insert sample data
-- ============================================
INSERT INTO properties (
    listing_id,
    title,
    description,
    price,
    area,
    location,
    listing_type,
    property_type,
    bedrooms,
    bathrooms,
    agency_fee,
    images,
    features
) VALUES
(
    'PROP-001',
    'Luxury Penthouse Downtown',
    'Experience unparalleled luxury in this stunning penthouse featuring floor-to-ceiling windows, modern Italian design, and breathtaking city views. This exclusive property offers the finest amenities and finishes.',
    15000,
    2500,
    'Madrid, Spain',
    'For Rent',
    'Penthouse',
    4,
    3,
    750,
    '[]'::jsonb,
    ARRAY['Pool', 'Gym', 'Parking', 'Concierge', 'Terrace']
),
(
    'PROP-002',
    'Beachfront Villa',
    'Wake up to the sound of waves in this spectacular beachfront villa. Featuring a private pool, lush gardens, and direct beach access, this property is perfect for those seeking tranquility and luxury.',
    25000,
    4500,
    'Barcelona, Spain',
    'For Rent',
    'Villa',
    5,
    4,
    1250,
    '[]'::jsonb,
    ARRAY['Beach Access', 'Private Pool', 'Garden', 'BBQ Area', 'Wine Cellar']
),
(
    'PROP-003',
    'Modern Studio in City Center',
    'Perfectly designed studio apartment in the heart of the city. Ideal for professionals or couples, featuring smart home technology and premium finishes throughout.',
    7500,
    850,
    'Miami, USA',
    'For Rent',
    'Studio',
    1,
    1,
    375,
    '[]'::jsonb,
    ARRAY['Smart Home', 'High Speed WiFi', 'Gym', 'Rooftop Terrace']
);

-- ============================================
-- Verification
-- ============================================
-- Run this to check if everything was created successfully
SELECT
    'Properties table created' as status,
    COUNT(*) as sample_properties
FROM properties;
