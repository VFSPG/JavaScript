# *** PG18 T2 JavaScript Web Apps  - Angry Pigs ***
---------------------------------------


this is a pretty bad coded game of angry pigs


## Synopsis
---------------
this is a node web app that lets you play angry birgs big version, it also allows you to create and edit levels of the game. 
It uses Box2d, express, jquery, path and http libraries in order to work properly.


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

you can select a level to play and it will show you the level of the level editor

you can aim the cannon pressing the w and s keys and shoot pressing space or clicking the cannon itseld


# *** Caveats ***
---------------------------------------

OH BOY... 
there is a lot that doesnt work just now...

#In the level editor:

- you can't delete levels
- the server is working syncronimusly (thats how you write that?) anyways thats bad 
- if you put the same name as other level it will overwrite it
- there is no checking of the things the user can write and thats unsafe for a webpage

#In the game:

- you cant change the force of the pigs
- you can't restart or go back to select a level
- your progress or score isn't recorded

THINGS I WANT TO SAY: I am so sorry this isn't the cleanest code i've ever written