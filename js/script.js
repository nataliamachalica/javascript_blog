{
  'use strict';

  const titleClickHandler = function(event){
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
    tagsListSelector:'.tags.list',
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
      //titleList.insertAdjacentHTML('afterbegin', linkHTML);

      titleList.innerHTML = titleList.innerHTML + linkHTML;
      html = html + linkHTML;
    }
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const calculateTagsParams = function(tags){

    const params = {
      min: 999999,
      max: 0
    };

    for (let tag in tags){
      console.log(tag + ' is used' + tags[tag] + ' times');

      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }

    /*if(tags[tag] > params.max){
      params.max = tags[tag];
      }
      if(tags[tag] < params.min){
        params.min = tags[tag];
      }*/

    return params;
  };

  const calculateTagClass = function(count, params){
    /*const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opt.CloudClassCount - 1) + 1);*/

    const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * opt.cloudClassCount + 1 );
    //console.log('classNumber:', classNumber);

    return opt.cloudClassPrefix + classNumber;
  };

  // *** GENEROWANIE TAGÓW *** //

  const generateTags = function(){

    let allTags = {};
    const articles = document.querySelectorAll(opt.articleSelector);

    for (let article of articles){
      const tagsWrapper = article.querySelector(opt.articleTagsSelector);
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for (let tag of articleTagsArray){
        const linkHTML = '<li><a href="#tag- ' + tag + '">' + tag + '</a></li>' + ' ';

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
    console.log('tagsParams:', tagsParams);

    let allTagsHTML = '';

    for(let tag in allTags){

      //allTagsHTML += '<li><a href="#tag-' + tag + '">' + tag + '(' + allTags[tag] + ')</a></li>';

      const tagLinkHTML = '<li><a href="#tag-' + tag + '"' + 'class="' + calculateTagClass(allTags[tag], tagsParams) + '"' + '>' + tag + ' ' + '</a></li>';

      //const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>';
      allTagsHTML += tagLinkHTML;
    }

    tagList.innerHTML = allTagsHTML;
  };
  calculateTagsParams();
  //calculateTagClass();
  generateTags();

  const tagClickHandler = function(event){

    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for(let activeTag of activeTags){

      /* remove class active */
      activeTag.classList.remove('active');

      /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for (let tagLink of tagLinks){

      /* add class active */
      clickedElement.classList.add('active'); //kliknięty element, nie tagLink -_-

      /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function(){

    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

    /* START LOOP: for each link */
    for (let tagLink of tagLinks){

      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);

      /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  // *** GENEROWANIE AUTORÓW *** //

  const generateAuthors = function(){

    /* [DONE]find all articles */
    const articles = document.querySelectorAll(opt.articleSelector);

    /* [DONE]START LOOP: for every article: */
    for(let article of articles){

      /* [DONE]find author wrapper */
      const authorsWrapper = article.querySelector(opt.articleAuthorSelector);
      let html = '';

      /* [DONE]get tags from author-tags attribute */
      const articleAuthors = article.getAttribute('data-author');

      /* [DONE]generate HTML of the link */
      const linkHTML = '<a href="#author-' + articleAuthors + '">' + articleAuthors + '</a>';

      /* [DONE]add generated code to html variable */
      html = html + linkHTML;

      /* insert HTML of all the links into the tags wrapper */
      authorsWrapper.innerHTML = html;

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
    const author = href.replace('#author-', '');

    /* find all tag links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    /* START LOOP: for each active tag link */
    for(let activeAuthorLink of activeAuthorLinks){

      /* remove class active */
      activeAuthorLink.classList.remove('active');

      /* [DONE]END LOOP: for each active author link */
    }

    /* [DONE]find all tag links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* [DONE]START LOOP: for each found tag link */
    for(let authorLink of authorLinks){
      console.log(authorLink);

      /* [DONE]add class active */
      clickedElement.classList.add('active');

      /* [DONE]END LOOP: for each found tag link */
    }

    /* [DONE]execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function(){

    //find all links to tags
    const linkAuthors = document.querySelectorAll('a[href^="#author-"]');

    //START LOOP: for each link
    for(let linkAuthor of linkAuthors){

      //add authorClickHandler as event listener for that link
      linkAuthor.addEventListener('click', authorClickHandler);

      /* END LOOP for each link*/
    }
  };

  addClickListenersToAuthors();
}