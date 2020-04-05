# Level Editor

## How to configure and run the project

1. Install the node-modules using **npm install** in the folder with the **package.json** file. 

2. To run the node server with nodemon: **npm run server**

3. To run the node server without nodemon: **npm run start**

4. Open it in: **localhost:3000/editor**

## How to use the editor

1. New Level Button: Clear all the info to create new level from scratch.

2. Load Button: Select levels saved on the serve and load them.

3. Save: Save all level info in the serve.

4. Add new: Open form to add new item to library
    * Fill the form and click save
    * The select of type determines it the item will be a target or a obstacle
    * Target items has a value property that can be filled
    * Images need to contain the extension(.jpg, .png)
    * Images need to be on Images folder

5. How it works
    * Fill the form with the level info
    * The background field load all images on the the directory. You just need to select one.
    * To add background image just save the file on the images/backgrounds directory and refresh the page.
    * Drag and drop the items from the assets section into the level screen
    * To delete an item just double cliked it
    * After finish just hit the save button

6. Editing Levels
    * Load the level from the select button.
    * Just edit anything you want and save it
    * To save as a new level just change the Level Name Field

**IF YOU SAVE A LEVEL WITH THE SAME NAME AS AN EXISTING ONE THE LEVEL WILL BE OVERWRITED**