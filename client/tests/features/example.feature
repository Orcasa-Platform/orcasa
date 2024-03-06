Feature: todo
 As a user
 I want to go to the homepage
 So that I can see the main nav

  Scenario: See nav menu on homepage
    Given a user has navigated to the homepage
    When the user looks at the page
    Then the user should see the main nav menu
    Then the main menu should have a Geospatial Data link
