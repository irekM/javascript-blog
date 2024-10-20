'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  // console.log('Title clicked:, clickedElement');
    
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');    
  // console.log('clickedElement', clickedElement);

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  // console.log('show article:', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optAuthorsListSelector = '.authors.list';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';


function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList*/
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  //check info about numbers of article
  //console.log('Generating title links for articles:', articles.length);  
  
  /*loop for each article*/

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';
  for(let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log('Created link HTML:', linkHTML);
    titleList.insertAdjacentHTML('beforeend', linkHTML);
    html = html + linkHTML;
  }
    
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

/* Function which finds min max values of tags */

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };

  for (let tag in tags) {
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    //console.log(tag + ' is used ' + tags[tag] + ' times');
  }
  return params;
}

function calculateTagClass(count, params) {
  //count subtraction resul
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount/normalizedMax;

  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) +1 );

  return optCloudClassPrefix + classNumber;
}

//Function which generate tags
function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  //show how many article has author
  //console.log('Generating authors for articles:', articles.length);

  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    // console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    //console.log(articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      //const tagHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;
      const tagHTMLData = { id: tag, title: tag };
      const tagHTML = templates.tagLink(tagHTMLData);
      /* add generated code to html variable */
      html += tagHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)) {
      /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */

    tagsWrapper.innerHTML = html;
  }
  /* END LOOP: for every article: */

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');
  //console.log(allTags);

  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams);
  /*[NEW] create variable for all linkt HTML code */
  const allTagsData = {tags: []};

  /*[NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /*[NEW] generate code of a link and add it to allTagsHTML */
    //const tagLinkHTML = `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}">${tag}</a></li>`;
    /*const tagLinkHTMLData = {
      id: tag,
      class: calculateTagClass(allTags[tag], tagsParams),
      title: tag */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    /* [NEW] END LOOP: for each tag in allTags */

    //allTagsHTML += tag + ' (' + allTags[tag] + ') ';
  }
  /* [NEW] Put generated HTML into the tag list of right column using Handlebars */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

//Behavior after click action

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  // Log the tag name
  //console.log('Extracted tag:', tag);

  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags) {
    /* remove class active */
    activeTag.classList.remove('active');
  }
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('active');
  }
  /* END LOOP: for each found tag link */

  // show articles which are filtered by this tag
  // console.log('Generating articles for tag:', tag);

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors() {
  //Create obj for numbers of articles of authors
  let allAuthors = {};
  //find all articles
  const articles = document.querySelectorAll(optArticleSelector);

  //loop of every article
  for (let article of articles) {
    //find author and put it into wrapper
    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    //find and get "data-author" tag
    const author = article.getAttribute('data-author');

    /* Log the author name for debugging purposes */
    // console.log('Author found:', author);

    //create new link for author
    //const authorHTML = '<a href="#author-' + author + '">' + author + '</a>';
    const authorHTMLData = { id: author, author: author };
    const authorHTML = templates.authorLink(authorHTMLData);
    //put authors link to html
    authorWrapper.innerHTML = authorHTML;
    
    //Count articles for authors
    if (!allAuthors.hasOwnProperty(author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  }
  //Create list of authors in right column
  const authorList = document.querySelector(optAuthorsListSelector);
  let allAuthorsData = { authors: [] };

  for (let author in allAuthors) {
    //allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] + ')</a></li>';
    allAuthorsData.authors.push({
      id: author,
      author: author,
      count: allAuthors[author]
    });
  }
  // Render the list of authors using Handlebars template
  authorList.innerHTML = templates.authorListLink(allAuthorsData);
}
  
  
//call the function
generateAuthors();

//click handler for author

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;

  //take value of href attribute
  const href = clickedElement.getAttribute('href');

  //delete author from hreg to take a name
  const author = href.replace('#author-', '');

  //show which author was clicked
  // console.log('Click on author:', author);

  //find all active links to authors
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

  //loop and delete active class from every active author
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }

  //find all of links of clicked authors
  const matchingLinks = document.querySelectorAll('a[href="' + href + '"]');

  //loop and add active class to whole authors
  for (let matchingLink of matchingLinks) {
    matchingLink.classList.add('active');
  }

  //create title for clicked author
  generateTitleLinks('[data-author="' + author + '"]');
}

//Add listener to author link

function addClickListenerToAuthors() {
  //find all links to authors
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  for (let authorLink of authorLinks) {
    //add listener on click for every link
    authorLink.addEventListener('click', authorClickHandler);
  }
}

//incoke function of click listener
addClickListenerToAuthors();


