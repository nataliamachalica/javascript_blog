'use strict';

/*document.getElementById('test-button').addEventListener('click', function(){
    const links = document.querySelectorAll('.titles a');
    console.log('links:', links);
  });*/

const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');

};

const opt = {
  articleSelector:'.post',
  titleSelector:'.post-title',
  titleListSelector:'.titles',
  articleTagsSelector:'.post-tags .list',
  /*CloudClassCount = 5,
      CloudClassPrefix = tag-size-*/
};
function generateTitleLinks(customSelector = ''){

  /* [DONE] remove contents of titleList */

  const titleList = document.querySelector(opt.titleListSelector);
  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(opt.articleSelector + customSelector);
  console.log('articles:', articles);

  let html='';

  for (let article of articles){

    /* get the article id */

    const articleId = article.getAttribute('id');
    console.log('articleId:', articleId);

    /* find the title element */
    /* get the title from the title element */
    console.log('opt.titleSelector:', opt.titleSelector);
    console.log('article:', article);
    console.log('article.querySelector(opt.titleSelector):', article.querySelector(opt.titleSelector));

    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
    console.log('articleTitle:', articleTitle);

    /* create HTML of the link */

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log('linkHTML:', linkHTML);

    /* insert link into titleList */

    titleList.insertAdjacentHTML('afterbegin', linkHTML);
    console.log('titleList:', titleList);

    console.log('html:', html);

  }
  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
    console.log('links:', links);
  }
}
generateTitleLinks();
