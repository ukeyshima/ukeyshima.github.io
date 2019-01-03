import React from 'react';

export default class WorkRelation extends React.Component {
  render() {
    return (
      <div className='workRelation'>
        {this.props.relation.map(e => {
          return e.hasOwnProperty('qiita') ? (
            <a className='qiita' target='_blank' href={e.qiita}>
              Q
            </a>
          ) : e.hasOwnProperty('shadertoy') ? (
            <a className='shadertoy' target='_blank' href={e.shadertoy}>
              S
            </a>
          ) : e.hasOwnProperty('github') ? (
            <a className='github' target='_blank' href={e.github}>
              G
            </a>
          ) : (
            <a className='demo' target='_blank' href={e.demo}>
              D
            </a>
          );
        })}
      </div>
    );
  }
}
