'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';

import './style.css';
import Building from './building';
import Data from './data';
import {Derivation} from './derivation';
import {formatNum, cultureIndex, popIndex, outputIndex, chapterIndex, renderChapter}
  from './util';

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.id_prefix = Math.floor(Math.random() * 1000000000000);
    this.state = {};
    this.updateCustomProperty = this.updateCustomProperty.bind(this);
  }

  getDerivedStateFromProps(props, state) {
    if (!(this.props.title in state)) {
      const building = Building(this.props.title, this.props.race);
      return { [this.props.title]: building && building.GetInitialState(props) }
    }
  }

  renderBody(data) {
    const rows = [];
    let popHeader = <th>Population</th>;
    const outName = data.Output;
    for(let i = data.getMinLevel(); i <= data.getMaxLevel(); i++) {
      const w = data.getWidth(i);
      const h = data.getHeight(i);
      const out = data.getDailyOutput(
        i, 
        this.props.collectCount, 
        this.props.relicBoost,
        this.state[data.name],
      );
      const pop = data.getPop(i);
      const cult = data.getCulture(i);
      const buildingSpace = w * h;
      const roadSpace = Math.min(w, h) / 2.0;
      const effectiveCultureDerivation = data.getEffectiveCultureDerivation(
        i,
        this.props.cultureDensity,
        this.props.residenceLevel,
        this.props.workshopLevel,
        this.props.collectCount,
        this.props.streetCulture,
      );
      const effectiveSpaceDerivation = effectiveCultureDerivation.clone();
      effectiveSpaceDerivation.scaleBy(1/this.props.cultureDensity);
      let popCell = <td>{pop}</td>;
      if (this.props.title == "Residence") {
        popCell = null;
        popHeader = null;
      }
      rows.push(
        <tr key={i}>
          <td>{w}x{h}</td>
          <td>{renderChapter(data.getChapter(i))}</td>
          <td className="rawData">{cult}</td>
          {popCell}
          <td className="rawData">{formatNum(out)}</td>
          <td className="rawData">{formatNum(out / cult)}</td>
          <td className="rawData">{formatNum(out / (buildingSpace + roadSpace))}</td>
          <td>
            <a data-tip="Hello" data-for={this.id_prefix + ":" + i}>
              {formatNum(effectiveCultureDerivation.getSum() / this.props.cultureDensity)}
            </a>
            <ReactTooltip place="top" type="dark" effect="float" id={this.id_prefix + ":" + i}>
              <ul className="tooltip">
                <Derivation word="spaces" item={effectiveSpaceDerivation} />
              </ul>
            </ReactTooltip>
          </td>
          <td>{formatNum(out * this.props.cultureDensity / effectiveCultureDerivation.getSum())}</td>
        </tr>
      );
    }

    return <table className="itemTable">
      <tbody>
        <tr>
          <th>Size</th>
          <th>Ch.</th>
          <th>Culture</th>
          {popHeader}
          <th>{outName}</th>
          <th>{outName}/Culture</th>
          <th>{outName}/Tile</th>
          <th>Spaces used</th>
          <th>Effective {outName} / Culture tile</th>
        </tr>
        {rows}
      </tbody>
    </table>;
  }

  renderForm(building) {
    if (!building.ConfigFormFactory) {
      return null;
    }
    return <div align="center">{building.ConfigFormFactory(this.updateCustomProperty, this.state[this.props.title])}</div>;
  }

  updateCustomProperty(newValues) {
    this.setState((oldState, props) => {
      return {[this.props.title]: Object.assign(newValues, oldState.customOptions) };
    });
  }

  render() {
    const building = Building(this.props.title, this.props.race);
    if (building.Valid) {
      return <div className="widget">
        <div align="center"><img src={building.Image} className="buildingImg"/></div>
        {this.renderForm(building)}
        {this.renderBody(building)}
      </div>;
    }
    return <div>Placeholder for {this.props.title}</div>;
  }
}

module.exports = Widget;
