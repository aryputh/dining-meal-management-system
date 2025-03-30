# Sprint 2 Report 
Video Link: INSERT
## What's New (User Facing)
 * Students can easily add funds to their accounts.
 * Admin can easily manage payment methods at any time.
 * Students can leave feedback for admin to view.
 * Admin can view student's feedback.
 * Buttons for payment system works as intended.

## Work Summary (Developer Facing)
During Sprint 2, we focused on enhancing core functionalities and improving the user experience. One of the major accomplishments was the Payment Management System, which allows students to manage their payment methods and select a preferred option when making a purchase. While no third-party payment integration was implemented, this feature lays the groundwork for future enhancements by ensuring a seamless selection process.

Additionally, we also implemented a Feedback System, allowing users to provide input on their experience. The system was designed with ease of use in mind, it has a simple interface for submitting and viewing feedback. On the backend, data storage and retrieval were optimized to ensure quick access to submissions.

Lastly, we addressed button styling and rendering issues that affected usability. Several buttons across the platform were either inconsistently styled or unresponsive. These were fixed to maintain a uniform design and ensure all interactive elements function properly. This sprint made significant improvements in usability, which allows us to focus on more refinements in the next sprint.

## Unfinished Work
We were able to finish everything we wanted to for the second sprint.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:
 * [04 Payment System](https://github.com/aryputh/dining-meal-management-system/issues/6)
 * [05 Feedback System](https://github.com/aryputh/dining-meal-management-system/issues/4)
 * [08 Button Issues](https://github.com/aryputh/dining-meal-management-system/issues/20)
 
 ## Incomplete Issues/User Stories
  Every issue we set out to complete was done by the end of sprint 2.

## Code Files for Review
Please review the following code files, which were actively developed during this sprint, for quality:
 * [FeedbackPopup.js](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/components/FeedbackPopup.js)
 * [Dashboard.js](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/pages/Dashboard.js)
 * [Global Styling](https://github.com/aryputh/dining-meal-management-system/blob/main/frontend/src/styles/global.css)
 
## Retrospective Summary
Here's what went well:
 * Payment System Implementation
    * A payment system was added (simply choose payment method). Testing was thorough, and we confirmed that payments were being processed correctly and logged in the database.
 * Feedback System
    * Users can now leave feedback, which helps improve the service and user experience.
    * The feedback form is easy to use, and feedback is displayed in an organized manner.
    * The backend efficiently stores and retrieves feedback, giving us quick access to user responses.
    * Error handling and validation were implemented to prevent spam or incomplete feedback submissions.
 * Button Styling and Rendering Fixes
    * Several button-related issues were resolved, ensuring all buttons are properly styled and visible.
    * UI consistency was improved by ensuring buttons had uniform styles across different pages.
    * All buttons function as expected, with no broken links or unresponsive elements.
 
Here's what we'd like to improve:
 * User Interface Consistency
    * While buttons were fixed, some UI elements still feel inconsistent in terms of spacing, font sizes, and colors.
    * Accessibility improvements (i.e. better contrast, keyboard navigation) should be considered.
 * Testing Coverage
    * More unit and integration tests should be written to ensure long-term stability.
  
Here are changes we plan to implement in the next sprint:
   * Meal Allergy System
   * Analytics System
   * Finalizing design and user experience
   * Small improvements and bug fixes
