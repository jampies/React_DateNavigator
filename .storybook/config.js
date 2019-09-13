import { configure } from '@storybook/react';

function loadStories() {
    require('../DateNavigator/DateNavigator.story');
}

configure(loadStories, module);