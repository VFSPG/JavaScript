# *** PG18 T2 JavaScript Web Apps  - Level Editor ***
---------------------------------------


this is a pretty bad coded level editor for an angry pigs game


## Synopsis
---------------
this is a node web app that allows you to create and edit levels for an upcoming angry pigs game. 
It uses express jquery, path and http libraries in order to work properly.


# *** How to use ***
---------------------------------------
first thing you have to download it, 

then run npm init, npm install to get node modules

after it installs run npm run server to make the project run on port 3000

you can search levels by user id, select a level and click in the button edit to edit it,
in the edit mode you can drag objects to change their position, or change the name of the level and ammo
you can also delete objects by double click them

remember to click save in order to save a change otherwhise all changes will be lost.


# *** Caveats ***
---------------------------------------

OH BOY... 
there is a lot that doesnt work just now...

- by today i still can't add new objects
- If you click the name of the level it wont load but if you click in the side it works perfectly... 
- you can change the userId anytime and mess everything up 
- there is an offset in the dragevent
- if you go beyond the editor space you can still drag the objects and lose them forever
- you can't delete levels
- the server is working syncronimusly (thats how you write that?) anyways thats bad 
- if you put the same name as other level it will overwrite it
- there is no checking of the things the user can write and thats unsafe for a webpage

Other things i want to say:

- i created my server having the api reference in mind but i wanted to change a lot of stuff 
like adding the stars and change the background, change the enemies catapults to birds to free, 
delete levels add another path to upload images... anyways... 
this assigment i leave it to function with the api requirements but for the next i want to change it and expand it

i actually just want to be over with this delivery to improve it in the next one
