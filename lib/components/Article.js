import React from 'react';

//===========================================
// javascript api for css styles in react using the style attribute on divs
//===========================================
const s = {
  article: {
    paddingBottom: 10,
    borderBottomStyle: 'solid',
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold'
  },
  date: {
    fontSize: '0.85em',
    color: '#888'
  },
  author: {
    paddingTop: 10,
    paddingBottom: 10
  },
  body: {
    paddingLeft: 20
  }
};

const dateDisplay = (dateString) => new Date(dateString).toDateString();

const Article = ({ article, author }) => {
  return (
    <div style={s.article}>
      <div style={s.title}>{article.title}</div>
      <div style={s.date}>{dateDisplay(article.date)}</div>
      <div style={s.author}>
        <a href={author.website}>
          {author.firstName} {author.lastName}
        </a>
      </div>
      <div style={s.body}>{article.body}</div>
    </div>
  );
};

export default Article;
