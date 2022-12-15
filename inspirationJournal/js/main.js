/**
 * @file main controller handles controller classes of app functions and changes to the view.
 * @author Alexander DK Courter
 * @version 1.0.0
 */

import Goal from './app/goals.js';
import HomeView from './app/homeView.js';
import Journal from './app/journal.js';
import Tracker from './app/moodtracker.js';

const homeScreen = new HomeView();
homeScreen.show();

const journal = new Journal();
const tracker = new Tracker();
const goals = new Goal();


window.addEventListener('pageChange', (e) => {
    let page = e.detail.page;

    switch(page){
        case 'journal':
            journal.show();
            break;
        case 'track':
            tracker.show();
            break;
        case 'goals':
            goals.show();
            break;
        case 'home':
            homeScreen.show();
            break;
        case 'edit':
            if(e.detail.entry){
                journal.openExistingEntry(e.detail.entry);
            } else {journal.edit();}
            break;
        case 'save':
            journal.saveNewEntry();
            journal.show();
            break;
        case 'update':
            journal.updateExistingEntry();
            journal.show();
            break;
        case 'delete':
            journal.deleteOpenedEntry();
            journal.show();
            break;
    }
})