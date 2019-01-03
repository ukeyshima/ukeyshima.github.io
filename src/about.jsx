import React from 'react';
import Header from './header.jsx';
import icon from './assets/img/icon.png';
import style from './style.scss';

export default class About extends React.Component {
  componentDidMount() {
    style.use();
  }
  componentWillUnmount() {
    style.unuse();
  }
  render() {
    return (
      <React.Fragment>
        <Header />
        <div>
          <div
            className='icon'
            style={{
              backgroundImage: `url(${icon})`
            }}
          />
          <div className='profile'>
            <h1>Profile</h1>
            <h3>島田 雄輝 (Yuki Shimada)</h3>
            <h2>所属</h2>
            <h3>
              明治大学 総合数理学部 先端メディアサイエンス学科 宮下研究室 B4
            </h3>
            <h2>研究分野</h2>
            <h3>Human-Computer Interaction, Programming Experience</h3>
            <h2>発表業績</h2>
            <h3>
              島田雄輝，薄羽大樹，宮下芳明．数式の記述方法を選択できるプログラミングインタフェース，第26回インタラクティブシステムとソフトウェアに関するワークショップ
              (WISS2018) 論文集，2018．
            </h3>
            <h2>趣味</h2>
            <h3>Programming, Computer-Graphics, 塾講師, 居合道</h3>
            <h2>資格</h2>
            <h3>剣道二段, 居合道二段</h3>
            <h2>関連リンク</h2>
            <h3>
              <a href='https://github.com/ukeyshima'>GitHub</a>
              <a href='https://www.shadertoy.com/user/ukeyshima'>
                Shadertoy
              </a>
              <a href='https://qiita.com/ukeyshima'>Qiita</a>
              <a href='https://twitter.com/ukeyshima'>Twitter</a>
            </h3>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
