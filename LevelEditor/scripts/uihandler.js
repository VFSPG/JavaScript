//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

//This class is in charge of handling the interface on the editor, allowing...
//... the user to utilice different tools within the editor.
export default class UIHandler{

    constructor() {
        
    }

    setAssetMenuEvents() {

        $('#assetMenuButton').on('click', event => {

            let icon = $("#assetMenuButtonIcon");
            icon.toggleClass("fa-arrow-circle-up");
            icon.toggleClass("fa-arrow-circle-down");

            let menu = $("#assetMenu");
            menu.toggleClass("assetMenuClosed");
            menu.toggleClass("assetMenuOpened");
        })

        //I'm using function to preserve the value of 'this' 
        $('.barButton, .assetMenuButton').hover ( function () {

            $( this ).toggleClass( "buttonHoverInColor" );
            $( this ).toggleClass( "buttonHoverOutColor" );
        });
    }

    intializePopUps() {
        $('#closePopUp').on('click', event => {
            $('.popUpSection').toggleClass('hide');
            let popUpContent = $('.popUpContent');

            for (let i = 0; i < popUpContent.length; i++) {

                let content = popUpContent[i];
                if(!content.classList.contains('hide')){
                    content.classList.add('hide')
                }
            }
        })
        
        //I use a function to be able to reuse the code in different situations
        function setTabs( event ){
            
            let tabContents = $(`.${event.data.content}`);
            let tag = `${$(this).attr('id')}-content`;

            $('.activeTab').addClass('inactiveTab');
            $('.activeTab').removeClass('activeTab');
            $(this).addClass('activeTab')
            $(this).removeClass('inactiveTab')

            for (let i = 0; i < tabContents.length; i++) {

                let tabContent = tabContents[i];
                if (tabContent.id == tag) {

                    tabContent.classList.remove( 'hide' );
                }
                else {

                    if(!tabContent.classList.contains( tag )) {
                        tabContent.classList.add( 'hide' );
                    }
                }
            }
        }

        $('.uploadTab').on('click' , { content: "uploadContent" }, setTabs);
        $('.loadTab').on('click' , { content: "loadContent" }, setTabs);
        $('.removeElementTab').on('click' , { content: "removeElementContent" }, setTabs);

        //I use a function to be able to reuse the code in different situations
        function hidePopUp( event ){
            
            $('#popUpWindow').toggleClass('hide');
            $(`#${event.data.id}`).toggleClass('hide');
        }

        $('#upload-button').on('click', { id: "upload-menu" }, hidePopUp);
        $('#load-button').on('click', { id: "load-menu" }, hidePopUp);
        $('#level-info-button').on('click', { id: "level-info-menu" }, hidePopUp);
        $('#remove-element-button').on('click', { id: "remove-element-menu" }, hidePopUp);
    }
}