'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import Data from './data';
import Building from './building';
import {formatNum, outputIndex} from './util';

class ResidenceCultureChecker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 9,
      pop: 600,
      cult: 600,
    }
    this.changer = this.changer.bind(this);
  }
  render() {
    let culture = parseInt(this.state.cult);
    let residence = Building("Residence", this.props.race);
    let culturePerResidence = residence.getEffectiveCultureDerivation(
      this.props.residenceLevel,
      this.props.cultureDensity,
      this.props.residenceLevel, // ignored
      this.props.residenceLevel, // ignored
      1, // collections per day; doesn't really matter
      this.props.streetCulture,
    ).getSum();
    culture += culturePerResidence * this.state.pop /
      residence.getOutput(this.props.residenceLevel);
    return <div className="widget">
      <table>
        <tbody>
          <tr>
            <td>Size</td>
            <td><input type="text" name="size"
              value={this.state.size} onChange={this.changer} />
            </td>
          </tr>
          <tr>
            <td>Population</td>
            <td><input type="text" name="pop"
              value={this.state.pop} onChange={this.changer} />
            </td>
          </tr>
          <tr>
            <td>Culture</td>
            <td><input type="text" name="cult"
              value={this.state.cult} onChange={this.changer} />
            </td>
          </tr>
          <tr>
            <td>Effective Culture</td>
            <td>{formatNum(culture)}</td>
          </tr>
          <tr>
            <td>Culture Per Tile</td>
            <td>{formatNum(culture / this.state.size)}</td>
          </tr>
        </tbody>
      </table>
    </div>;
  }
  changer(event) {
    const newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }
}

module.exports = ResidenceCultureChecker;
