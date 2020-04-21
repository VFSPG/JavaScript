# *** PG18 T2 JavaScript Web Apps  - Angry Pigs ***
---------------------------------------


this is a pretty bad coded game of angry pigs


## Synopsis
---------------
this is a node web app that lets you play angry birgs big version, it also allows you to create and edit levels of the game. 
It uses express jquery, path and http libraries in order to work properly.


# *** How to use ***
---------------------------------------
first thing you have to download it, 

then run npm init, npm install to get node modules

after it installs run npm run server to make the project run on port 3000

# for the level editor 

you have to the localhost:3000/editor route

you can search levels by user id, select a level and click in the button edit to edit it,
in the edit mode you can drag objects to change their position, or change the name of the level and ammo
you can also delete objects by double click them, change the backgroud of the level and change the amount of 
points needed to pass with 1, 2 or 3 stars

remember to click save in order to save a change otherwhise all changes will be lost.


# for the game

you have to the localhost:3000 route

you can select a level and click on the cannon to shoot a pig


# *** Caveats ***
---------------------------------------

OH BOY... 
there is a lot that doesnt work just now...

#In the level editor:

- still can't add new objects... sorry i forgot to do that
- you can change the userId anytime and mess everything up 
- if you go beyond the editor space you can still drag the objects and lose them forever
- you can't delete levels
- the server is working syncronimusly (thats how you write that?) anyways thats bad 
- if you put the same name as other level it will overwrite it
- there is no checking of the things the user can write and thats unsafe for a webpage

#In the game:

- there is no user interface that tells you how much ammo you have left, your score or the name of the level
- you cant change the direction of the pigs or the force
- the birds aren't dissapearing on hit 
- you can't restart or go back to select a level
- your progress or score isn't recorded


THINGS I WANT TO SAY:

MAYBE YOU SHOULD TRY LEVEL 4
