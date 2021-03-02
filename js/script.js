{
  'use strict';

  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');

  };

  const opt = {
    articleSelector:'.post',
    titleSelector:'.post-title',
    titleListSelector:'.titles',
    articleTagsSelector:'.post-tags .list',
    articleAuthorSelector:'.post-author',
    tagListSelector:'.tags.list a',
    cloudClassCount: 5,
    cloudClassPrefix: 'tag-size-'
  };

  const generateTitleLinks = function(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(opt.titleListSelector);
    titleList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(opt.articleSelector + customSelector);

    let html = '';

    for (let article of articles){

      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opt.titleSelector).innerHTML;

      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      /* insert link into html variable */
      titleList.insertAdjacentHTML('afterbegin', linkHTML);
    }
    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const calculateTagsParams = function (tags){

    const params = {min: 999999, max: 0};

    for (let tag in tags){
      console.log(tag + ' is used' + tags[tag] + ' times');

      if(tags[tag] > params.max){
        params.max = tags[tag];
      }
      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }
    return params;
  };

  const calculateTagClass = function (count, params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opt.CloudClassCount - 1) + 1);

    return opt.CloudClassPrefix + classNumber;
  };

  const generateTags = function (){

    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(opt.articleSelector);

    /* START LOOP: for every article: */
    for (let article of articles){

      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opt.articleTagsSelector);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');

      /* START LOOP: for each tag */
      for (let tag of articleTagsArray){

        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag- ' + tag + '">' + tag + '</a></li>' + '';

        /* add generated code to html variable */
        html = html + linkHTML;

        /* [NEW] check if this link is NOT already in allTags */

        if(!allTags[tag]){

          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');
    console.log(tagList);

    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags */
    for(let tag in allTags){
    /* NEW generate code of a link and add it to allTagsHTML */
    //allTags += tag + '(' + allTags[tag] + ')';

      //const tagLinkHTML = '<li><a href="#tag- ' + tag + '">' + tag + '</a></li>';
      //console.log(tagLinkHTML);
      const tagLinkHTML = '<li><a class="'+ calculateTagClass(allTags[tag], tagsParams) + '" href="#tag- ' + tag + '">' + tag + '</a></li>';
      allTagsHTML += tagLinkHTML;

      /* NEW END LOOP: for each tag in allTags: */
    }
    /* [NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  };

  generateTags();

  const tagClickHandler = function (event){

    /* prevent default action for this event */

    event.preventDefault();
    console.log('event', event);

    /* make new constant named "clickedElement" and give it the value of "this" */

    const clickedElement = this;
    console.log('tag link was clicked!');
    console.log('this', clickedElement);

    /* make a new constant "href" and read the attribute "href" of the clicked element */

    const href = clickedElement.getAttribute('href');
    console.log('href', href);

    /* make a new constant "tag" and extract tag from the "href" constant */

    const tag = href.replace('#tag-', '');
    console.log('tag', tag);

    /* find all tag links with class active */

    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
    console.log('activeTags:', activeTags);

    /* START LOOP: for each active tag link */

    for(let activeTag of activeTags){
      console.log('activeTag:', activeTag);

      /* remove class active */
      activeTag.classList.remove('active');

      /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */

    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    console.log('tagLinks:', tagLinks);

    /* START LOOP: for each found tag link */

    for (let tagLink of tagLinks){
      console.log('tagLink:', tagLink);

      /* add class active */

      tagLinks.classList.add('active');

      /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */

    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function(){

    /* find all links to tags */

    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    console.log('tagLinks:', tagLinks);

    /* START LOOP: for each link */

    for (let tagLink of tagLinks){
      console.log('tagLink:', tagLink);

      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);

      /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();


  //początek autorów

  const generateAuthors = function(){

    /* [DONE]find all articles */
    const articles = document.querySelectorAll(opt.articleSelector);

    /* [DONE]START LOOP: for every article: */
    for(let article of articles){

      /* [DONE]find author wrapper */
      const authorList = article.querySelectorAll(opt.articleAuthorSelector);
      //article.querySelector(opt.articleAuthorSelector);

      /* [DONE]make html variable with empty string */
      let html = '';

      /* [DONE]get tags from author-tags attribute */
      const articleAuthors = article.getAttribute('data-authors');

      /* START LOOP: for each author */
      for(let author in articleAuthors){

        /* [DONE]generate HTML of the link */
        const linkHTML = '<li><a href="#author-' + author + '"<span>' + author + '</span></a></li>';

        /* [DONE]add generated code to html variable */
        html = html + linkHTML;

      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      authorList.innerHTML = html;

      /* END LOOP: for every article: */
    }
  };

  generateAuthors();

  const authorClickHandler = function(event){

    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href;

    /* find all tag links with class active */
    const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

    /* START LOOP: for each active tag link */
    for (let activeAuthor of activeAuthors) {

      /* remove class active */
      activeAuthor.classList.remove('active');

      /* [DONE]END LOOP: for each active author link */
    }

    /* [DONE]find all tag links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href^="#author-' + author + '"]');

    /* [DONE]START LOOP: for each found tag link */
    for (let authorLink of authorLinks){

      /* [DONE]add class active */
      authorLink.classList.add('active');

      /* [DONE]END LOOP: for each found tag link */
    }

    /* [DONE]execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + author + '"]');
  };

  const addClickListenersToAuthors = function(){

    //find all links to tags
    const authorLinks = document.querySelectorAll(opt.articleAuthorSelector);

    //START LOOP: for each link
    for (let author of authorLinks){

      //add authorClickHandler as event listener for that link
      author.addEventListener('click', authorClickHandler);

      /* END LOOP for each link*/
    }
  };

  addClickListenersToAuthors();

  //koniec autorów
}