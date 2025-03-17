# Sprint 1 Report 
Video Link: https://www.youtube.com/watch?v=-B1_y552s7U

## What's New (User Facing)
 * Users can login to the system.
 * Users can register with the system.
 * Students can view meals and menus.
 * Students can place orders and see their balance.
 * Students can add meal plans to their accounts.
 * Students can add funds to their accounts.
 * Students can see history tracking.
 * Admin add, edit, create, or delete meal plans, menus, and meals.
 * Integration with Supabase, Firebase Hosting, and React.js.

## Work Summary (Developer Facing)
During this sprint we accomplished the creation of the basic framework for our dining meal plan management project. To do this we first set about creating the database using our ER Diagram as a reference. During the implenetation though, we did decide to change the database because the meal plan amount and balance system did not work well together and caused issues. The biggest barriers for this sprint were connecting the supabase database to the react project and getting all of the buttons to work with the correct tables, as some data would go into different tables and retrieve data from the wrong table. The biggest takeaway for our team this sprint was how hard it is to get things set up and working propelry. Everyone has different machines and it can be difficult to get code working on all of them especially for how big our project is and all of the dependencies. 

## Unfinished Work
We were able to finish everything we wanted to for the first sprint.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:
 * [03-1 Meal Plan and Menu Management](https://github.com/aryputh/dining-meal-management-system/issues/5)
 * [Create ER Diagram For Project](https://github.com/aryputh/dining-meal-management-system/issues/17)
 * [Full platform testing](https://github.com/aryputh/dining-meal-management-system/issues/14)
 * [07 Populate Database with Values](https://github.com/aryputh/dining-meal-management-system/issues/10)
 * [03-3 Meal Tracking](https://github.com/aryputh/dining-meal-management-system/issues/8)
 * [03-2 Allow admin to manage meal plans](https://github.com/aryputh/dining-meal-management-system/issues/12)
 * [01 Login System](https://github.com/aryputh/dining-meal-management-system/issues/3)
 * [02 Register System](https://github.com/aryputh/dining-meal-management-system/issues/2)
 
 ## Incomplete Issues/User Stories
 Every issue we set out to complete was done by the end of sprint 1.

## Code Files for Review
Please review the following code files, which were actively developed during this sprint, for quality:
 * [Access Denied Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/pages/AccessDenied.js)
 * [Dashboard Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/pages/Dashboard.js)
 * [Add Funds Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/components/AddFundsPopup.js)
 * [Auth Popup Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/components/AuthPopup.js)
 * [History Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/components/History.js)
 * [Manage Meal Plan Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/components/ManageMealPlans.js)
 * [Manage Meals Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/components/ManageMeals.js)
 * [Manage Menus Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/components/ManageMenus.js)
 * [Manage Payment Methods Page](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/components/ManagePaymentMethods.js)
 
## Retrospective Summary
Here's what went well:
 * Meal Plan and Menu Management
    * Admins can create, edit, and delete meal plans.
    * Admins can create and manage menus, setting availability dates and associating meals with specific menus.
    * Each menu allows admins to add or remove meals, including defining meal names, descriptions, and prices.
    * Implemented real-time updates to reflect menu and meal changes immediately without requiring a page refresh.
 * User Authentication System
    * Integrated Supabase Auth to manage user login and registration.
    * Role-based authentication ensures students and admins have permissions and see different views on the platform.
    * Students can view meal plans, deposit funds, and track their balances, while admins can manage meal plans, menus, and payment methods.
 * Meal Tracking for Students
    * Implemented a history system where students can view all meal related transactions.
    * The history feature logs deposits (credit card, dining dollars, etc.), meal purchases (through the order button), starting balances, and remaining balances in real time.
    * Ensured that purchase transactions immediately deduct from the student's balance and display in their history.
 * Testing went really well, we didn't run into many issues with how stuff was implemented and everything matched our user stories and functional requirements.
 * Communication between everyone in the group was great. We were all able to discuss and coordinate the implementation and testing of our project. 
 
Here's what we'd like to improve:
 * Planning. It was difficult to find times to meet up because of everyones schedule being so full.
 * Another challenge was estimating the time required for feature development. Some tasks took longer than initially anticipated, leading to minor delays in execution. Another area for improvement was documentation. While the core features were implemented successfully, more detailed documentation would help new team members and streamline future development. Also, debugging proved to be time consuming at certain points, and implementing a more structured debugging process could help reduce delays.
 
Here are changes we plan to implement in the next sprint:
 * Payment System (adding support to prompt for card numbers)
 * Feedback System (students can submit feedback and admin can view feedback)
 * Analytics System (admin can see meal plan and menu statistics)
 * Improvement of system styling (fix layouts and elements)
 * To improve future sprints, we have identified several actionable items. First, we need to enhance our task estimation process by implementing a time tracking system. This will allow us to log the actual time taken for each task and use historical data for more accurate sprint planning. Second, we should improve documentation by creating a centralized knowledge base that includes details on feature implementations and development workflows. Third, optimizing our debugging process will be crucial. Setting up structured debugging workflows, including logging errors more effectively utilizing Supabase monitoring tools, will help resolve issues more efficiently.
 * Additionally, enhancing our testing procedures will be a priority. Implementing tests for critical functionalities will help catch errors earlier in the development process, reducing the need for tons of debugging. Finally, improving communication on blockers will ensure that issues are addressed in a timely manner. Establishing daily check-ins or async updates will allow team members to report and resolve blockers more efficiently.
