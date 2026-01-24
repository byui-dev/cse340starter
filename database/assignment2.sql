-- Insert new record to account table 
INSERT INTO public.account (
  account_firstname, 
  account_lastname, 
  account_email, 
  account_password
)
VALUES (
  'Tony', 
  'Stark', 
  'tony@starkent.com', 
  'Iam1ronM@n'
);

-- Modify the Tony Stark record to change the account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';      

-- Delete the Tony Stark record from the database
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Update GM Hummer record using replace function
UPDATE public.inventory
SET inv_description = REPLACE(
  inv_description, 
  'small interiors', 
  'a huge interior'
)
WHERE inv_make = 'GM' AND inv_model = 'Hummer' ;

-- Inner join between the inventory and classification tables to pull 
-- make, model, and classification name, filtering only those items in the Sport category
SELECT 
i.inv_make,
i.inv_model,
c.classification_name
FROM
    public.inventory i
INNER JOIN
    public.classification c
ON
    i.classification_id = c.classification_id
WHERE
    c.classification_name = 'Sport';

-- Update all records in the inventory table to add "/vehicles" to the middle of the file
-- path in the inv_image and inv_thumbnail columns using a single query
UPDATE public.inventory
SET 
  inv_image = REPLACE(
    inv_image, 
    '/images/', 
    '/images/vehicles/'
  ),
  inv_thumbnail = REPLACE(
    inv_thumbnail, 
    '/images/', 
    '/images/vehicles/'
  );