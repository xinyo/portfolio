## product

1. take customer item in navigation-model as example, product item should have hover effect, add a sub layer navigation for product-categories.tsx, click product will redirect to route /product/{id}/[navigate item] top is back to product-cagegories, below is navigation item: `Product Options`, `Buying`, `Pricing`. default route is the 1st item. each one should have view file in views/product folder.
2. in Product options view, use Field component and Seperate component to creat a 2-colum form.
   1st section are Switch with: i buy this item, i sell this item, I track stock this item, I track costs and markups for this item, item is brought/sold tax-free
   2nd section are Selects,
   `bought/sold in` Select with options `basic quantities` `lineal metres` `custom formula` `square metres`;
   `prodcut categories` Select with options from the store `categories`
   `Available Materials` Select with multi selection with options from the store `materials`

3) buying view, use Field component with 2 Select, `Suppliers` Select with multi selection with options from the store `Suppliers`, `Preferred Supplier`Select with options from the store `Suppliers`

4) Pricing view, has 3 different tables. use ButtonGroup to switch the table to show.
   buttons are `buying` `selling` `tracking`. for `buying`, the table will show the all selected provider with the name as column header, and price below.
   for `selling` table will show `Cost` `Markup` `Price` 3 column. use mock data for now.
   for `tracking` table will show `On Hand` `Promised` `Available` `On The Way`. use mock data for now.

5) each view have a save primary button. keep it dummy for now.

## suppliers

1. follow the mock.json customers, create 5 mock suppliers.
2. supplier have 2 extra attributes. 1st is purchase history, include `id` `created date` `create by`(use one of the mock employee id) `total cost` `status`(draft submitted Received billed archived).
3. 2nd extra attribute is `Supplied Products`, value is array, pick 1-2 product mock id.
