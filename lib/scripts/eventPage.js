import {BingTranslate} from './services/bingTranslate'

console.log('eventPage running');

//sets up default data in localStorage
function setupDefaultData() {
  console.log('Initializing Local Storage');
  var localData = {
    initialized: true,
    activation: true,
    blacklist: '(stackoverflow.com|github.com|code.google.com|developer.*.com|duolingo.com)',
    savedPatterns: JSON.stringify([
      [
        ['en', 'English'],
        ['it', 'Italian'], '25', true, 'Yandex'
      ],
      [
        ['en', 'English'],
        ['de', 'German'], '15', false, 'Yandex'
      ]
    ]),
    sourceLanguage: 'en',
    targetLanguage: 'it',
    translatedWordStyle: 'font-style: inherit;\ncolor: rgba(255,153,0,1);\nbackground-color: rgba(256, 100, 50, 0);',
    userBlacklistedWords: '(this|that)',
    translationProbability: 15,
    minimumSourceWordLength: 3,
    ngramMin: 1,
    ngramMax: 1,
    userDefinedTranslations: '{"the":"the", "a":"a"}',
    translatorService: 'Yandex',
    yandexTranslatorApiKey: '',
    googleTranslatorApiKey: '',
    bingTranslatorApiKey: ''
  };
  chrome.storage.local.set(localData);
}

//On first installation, load default Data and initialize context menu
chrome.runtime.onInstalled.addListener(function() {
  setupDefaultData();
  chrome.contextMenus.create({
    'title': 'MindTheWord',
    'id': 'parent',
    'contexts': ['selection', 'page']
  });
  chrome.contextMenus.create({
    'title': 'Blacklist this website',
    'parentId': 'parent',
    'id': 'blacklistWebsite'
  });
  chrome.contextMenus.create({
    'title': 'Blacklist selected word',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'blacklistWord'
  });
  chrome.contextMenus.create({
    'title': 'Save word to dictionary',
    'parentId': 'parent',
    'contexts': ['selection'],
    'id': 'saveWord'
  });
});

// context menu handlers
chrome.contextMenus.onClicked.addListener(onClickHandler);
function onClickHandler(info, tab) {
  if (info.menuItemId == "blacklistWebsite") {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
      chrome.runtime.sendMessage({updateBlacklist: 'Add website to blacklist', tabURL: tabs[0].url}, function(r) {});
    });

  } else if (info.menuItemId == "blacklistWord") {
    selectedText = info.selectionText;

    if (selectedText.indexOf(' ') < 0) {
      chrome.runtime.sendMessage({updateUserBlacklistedWords: 'Add words to blacklist', word: selectedText}, function(r) {});
    }
    else {
      alert('Please select only a single word. "' + selectedText + '" is not allowed.'  );
    }
  } else if (info.menuItemId === "saveWord") {
      selectedText = info.selectionText;
      var translation = currentTranslatedMap[selectedText];
      if (currentTranslatedMap[selectedText]) {
        console.log('To save:' + selectedText);
        chrome.runtime.sendMessage({updateUserDictionary: 'Add word to dictionary', word: selectedText, translation: translation}, function(r) {});
      }
      else {
        alert('Please select translated word. "' + selectedText + '" is not translated.'  );
      }
  }
}

// google_analytics('UA-1471148-13');

console.log('eventPage ended');
