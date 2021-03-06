{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
  };

  const opt = {
    articleSelector:'.post',
    titleSelector:'.post-title',
    titleListSelector:'.titles',
    articleTagsSelector:'.post-tags .list',
    articleAuthorSelector:'.post-author',
    tagsListSelector:'.tags.list',
    authorListSelector:'.list.authors',
    cloudClassCount: 5,
    cloudClassPrefix: 'tag-size-'
  };

  // -- OBSŁUGA KLIKNIĘCIA W LINK --

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);
    targetArticle.classList.add('active');
  };

  // --- GENEROWANIE LINKÓW TYTUŁÓW ---

  const generateTitleLinks = function(customSelector = ''){

    const titleList = document.querySelector(opt.titleListSelector);
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(opt.articleSelector + customSelector);
    let html = '';

    for (let article of articles){

      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(opt.titleSelector).innerHTML;

      // handlebars:
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);

      html = html + linkHTML;
    }

    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();

  // -- KALKULATOR TAGÓW --

  const calculateTagsParams = function(tags){

    const params = {
      min: 999999,
      max: 0
    };

    for (let tag in tags){
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }

    return params;
  };

  const calculateTagClass = function(count, params){

    const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * opt.cloudClassCount + 1 );

    return opt.cloudClassPrefix + classNumber;
  };

  // --- GENEROWANIE TAGÓW --- //

  const generateTags = function(){

    let allTags = {};
    const articles = document.querySelectorAll(opt.articleSelector);

    for (let article of articles){
      const tagsWrapper = article.querySelector(opt.articleTagsSelector);
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for (let tag of articleTagsArray){

        // handlebars:
        const linkHTMLData = {id: tag, tag: tag};
        const linkHTML = templates.tagLink(linkHTMLData);

        html = html + linkHTML;

        if(!allTags[tag]){

          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      tagsWrapper.innerHTML = html;
    }

    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);

    // handlebars:
    const allTagsData = { tags: [] };

    for(let tag in allTags){

      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }

    tagList.innerHTML = templates.tagCloudLink(allTagsData);

  };
  calculateTagsParams();
  generateTags();

  // --- OBSŁUGA KLIKNIĘCIA W TAG ---

  const tagClickHandler = function(event){

    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

    for(let activeTag of activeTags){
      activeTag.classList.remove('active');
    }

    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

    for (let tagLink of tagLinks){
      clickedElement.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  // --- CLICK LISTENER DLA TAGÓW ---

  const addClickListenersToTags = function(){
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

    for (let tagLink of tagLinks){
      tagLink.addEventListener('click', tagClickHandler);
    }
  };

  addClickListenersToTags();

  // --- KALKULATOR AUTORÓW --- //

  const calculateAuthorsParams = function(authors){
    const params = {
      min: 999999,
      max: 0
    };

    for (let author in authors){
      params.max = Math.max(authors[author], params.max);
      params.min = Math.min(authors[author], params.min);
    }
    return params;
  };

  const calculateAuthorClass = function(count, params){
    const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * opt.cloudClassCount + 1 );
    return opt.cloudClassPrefix + classNumber;
  };

  // --- GENEROWANIE LISTY AUTORÓW ---

  const generateAuthors = function(){
    let allAuthors = {};
    //let allAuthors = [];
    const articles = document.querySelectorAll(opt.articleSelector);

    for(let article of articles){
      const authorsWrapper = article.querySelector(opt.articleAuthorSelector);
      let html = '';
      const articleAuthors = article.getAttribute('data-author');

      // handlebars:
      const linkHTMLData = {id: articleAuthors, title: articleAuthors };
      const linkHTML = templates.authorLink(linkHTMLData);

      html = html + linkHTML;
      authorsWrapper.innerHTML = linkHTML;

      if(!allAuthors[articleAuthors]){
        allAuthors[articleAuthors] = 1;
      }else {
        allAuthors[articleAuthors]++;
      }
    }

    /* list of authors in the right column */

    const authorsList = document.querySelector('.authors');
    const authorsParams = calculateAuthorsParams(allAuthors);
    console.log('authorsParams:', authorsParams);

    let allAuthorsHTML = '';
    const allAuthorsData = { authors: [] };
    for(let author in allAuthors){

      // handlebars:
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateAuthorClass(allAuthors[author], authorsParams)
      });
    }

    authorsList.innerHTML = templates.authorListLink(allAuthorsData);
  };
  generateAuthors();

  // --- OBSŁUGA KLIKNIĘCIA AUTORA ---

  const authorClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    for(let activeAuthorLink of activeAuthorLinks){
      activeAuthorLink.classList.remove('active');
    }

    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

    for(let authorLink of authorLinks){
      clickedElement.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
  };

  // --- CLICK LISTENERS DLA AUTORÓW ---

  const addClickListenersToAuthors = function(){
    const linkAuthors = document.querySelectorAll('a[href^="#author-"]');

    for(let linkAuthor of linkAuthors){
      linkAuthor.addEventListener('click', authorClickHandler);
    }
  };

  addClickListenersToAuthors();
}