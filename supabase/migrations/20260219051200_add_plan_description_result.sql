-- Add description and result fields to plans
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'plans' AND column_name = 'description'
  ) THEN
    ALTER TABLE plans ADD COLUMN description text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'plans' AND column_name = 'result'
  ) THEN
    ALTER TABLE plans ADD COLUMN result text DEFAULT '';
  END IF;
END $$;