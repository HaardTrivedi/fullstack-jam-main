# Reflection
This document showcases the my assumptions, approach and future implementations for the Jam application

#### Assumptions
1. The web app is from the perspective of an investor browsing companies
2. *My List* is the default home page and shows all companies in the database
3. Companies cannot be removed from *My List*
4. Companies can be present in multiple collections simultaneously
5. *Liked Companies* is a special collection that exists by default
6. New companies may not be added by the use because they are an investor

#### Approach
1. Create 2 buttons: 1 for Like and 1 for Unliking
2. Disable buttons by default and enable when row are selected
3. Like companies can be liked again but it won't make a difference
4. Unliked companies can be unliked again but it won't make a difference
5. 1 button to add to custom collection that opens a dialog box to select from collections. Pressing add will add selected companies to custom collection
6. *Add to Collection* button disbaled by default and enabled when rows are selected
7. 1 button to remove selected companies from active collection
8. *Remove from Collection* button disbaled by default and enabled when rows are selected. It will always be disabled when the active collection is *My List* since no companies can be deleted from it
9. Pressing any of the buttons will redirect user to *Status* page
10. Status page to show pending database operations and current progression in percent. If there is an operation in progress, a laoding bar is visible. All operations in progress listed at the top
11. *Add Collection* page includes form to allow user to add custom collection. Collection name must be unique and not empty. Success and error message banner pops up after *Add* button is pressed.
12. Add button is only enabled when textbox is not empty

#### Tradeoffs
1. Perform all add and remove to collection operations asynchronously regardless of the size of the data to reduce any latency
2. Redirect user to *Status* page after like, unlike, add to and remove from collection regardless of size
3. Liked and non-like companies can have the same operation performed on them. Verification of whether an association exists will be done on the database end. It might increase the latency a bit but simplify user experience for the first iteration
4. *Like* & *Add to Collection* and *Unlike* & *Remove from Collection* APIs will be the respectively, the only difference being the Collection name being passed to decrease ode duplication

#### Future Considerations
1. Create views for different types of users; investor (current) and admin
2. Only enable *Like* button if no company that is already liked is present
3. Only enable *Dislike* button if all companies selected are liked
4. Admin view can give user the functionality to add companies
5. Add retention period for operations in *Status* page
6. Add progress bar for operations in *Status* page with the existing percentage
7. Add like icon instead of current boolean for liked companies, none if they are not liked