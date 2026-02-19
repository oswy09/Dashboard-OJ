/*
  # Add Currency Support to Plans and Extras

  1. Changes
    - Add `currency` column to `plans` table (default: 'COP')
    - Add `currency` column to `extras` table (default: 'COP')
    - Add `price_usd` column to `plans` table for USD pricing
    - Add `price_usd` column to `extras` table for USD pricing
    - Add `price_cop` column to `plans` table for COP pricing
    - Add `price_cop` column to `extras` table for COP pricing
    
  2. Notes
    - Existing `price` column will be used as COP price
    - System will support both COP and USD
    - Default currency is COP (Colombian Peso)
*/

-- Add currency support to plans table
DO $$
BEGIN
  -- Add currency column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'plans' AND column_name = 'currency'
  ) THEN
    ALTER TABLE plans ADD COLUMN currency text DEFAULT 'COP';
  END IF;

  -- Rename price to price_cop if price_cop doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'plans' AND column_name = 'price_cop'
  ) THEN
    ALTER TABLE plans RENAME COLUMN price TO price_cop;
  END IF;

  -- Add price_usd column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'plans' AND column_name = 'price_usd'
  ) THEN
    ALTER TABLE plans ADD COLUMN price_usd integer DEFAULT 0;
  END IF;
END $$;

-- Add currency support to extras table
DO $$
BEGIN
  -- Add currency column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'extras' AND column_name = 'currency'
  ) THEN
    ALTER TABLE extras ADD COLUMN currency text DEFAULT 'COP';
  END IF;

  -- Rename price to price_cop if price_cop doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'extras' AND column_name = 'price_cop'
  ) THEN
    ALTER TABLE extras RENAME COLUMN price TO price_cop;
  END IF;

  -- Add price_usd column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'extras' AND column_name = 'price_usd'
  ) THEN
    ALTER TABLE extras ADD COLUMN price_usd integer DEFAULT 0;
  END IF;
END $$;
