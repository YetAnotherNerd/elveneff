'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

import Data from './data';
import Building from './building';
import Widget from './widget';
import ResidenceCultureChecker from './rescult';
import LeftNav from './left';
import HelpWindow from './help';

class WidgetOrSelectorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedBuilding: props.defaultBuilding};
  }
  render() {
    let child = undefined;
    if (this.state.selectedBuilding == "rescult"){
      child = <ResidenceCultureChecker
        cultureDensity={this.props.cultureDensity}
        residenceLevel={this.props.residenceLevel}
        streetCulture={this.props.streetCulture}
        race={this.props.race}
      />;
    } else if (this.state.selectedBuilding){
      child = <Widget
        title={this.state.selectedBuilding}
        cultureDensity={this.props.cultureDensity}
        residenceLevel={this.props.residenceLevel}
        streetCulture={this.props.streetCulture}
        race={this.props.race}
        workshopLevel={this.props.workshopLevel}
        collectCount={this.props.collectCount} />;
    }
    const buildings = [];
    for (var name in Data.BuildingMeta) {
      buildings.push(<option value={name} key={name}>{name}</option>);
    }
    return <td>
      <select onChange={(event) => { if (event.target.value) this.setState({selectedBuilding: event.target.value})} }>
        <option value={null}>Select a Building</option>
        <option value="rescult">Residence/Culture Calculator</option>
        {buildings}
      </select>
      <br />
      {child}
    </td>;
  }

}


class MainWindow extends React.Component {
  render() {
    let body;
    if (this.props.help) {
      body = <HelpWindow toggleHelp={this.props.toggleHelp}/>;
    } else {
      body = <table className="widgetRow">
        <tbody>
          <tr>
            <WidgetOrSelectorContainer key="left"
              defaultBuilding={"Residence"}
              cultureDensity={this.props.cultureDensity}
              residenceLevel={this.props.residenceLevel}
              workshopLevel={this.props.workshopLevel}
              collectCount={this.props.collectCount}
              race={this.props.race}
              streetCulture={this.props.streetCulture} />
            <WidgetOrSelectorContainer key="right"
              defaultBuilding={"Workshop"}
              cultureDensity={this.props.cultureDensity}
              residenceLevel={this.props.residenceLevel}
              workshopLevel={this.props.workshopLevel}
              collectCount={this.props.collectCount}
              race={this.props.race}
              streetCulture={this.props.streetCulture} />
          </tr>
        </tbody>
      </table>;
    }
    return <div id="mainContent">
      {body}
    </div>;
  }
}

class ElvenarCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cultureDensity: 100,
      collectCount: 3,
      residenceLevel: 18, // really level 19, but 0 indexing
      workshopLevel: 18,
      streetCulture: 49,
      race: "Elves",
      showHelp: true,
    };
    this.quickSelect = this.quickSelect.bind(this);
    this.setProp = this.setProp.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
  }

  render() {
    const window = <MainWindow
      help={this.state.showHelp}
      toggleHelp={this.toggleHelp}
      cultureDensity={this.state.cultureDensity}
      residenceLevel={this.state.residenceLevel}
      workshopLevel={this.state.workshopLevel}
      collectCount={this.state.collectCount}
      streetCulture={this.state.streetCulture}
      race={this.state.race}
    />;
    const left = <LeftNav parent={this}
      cultureDensity={this.state.cultureDensity}
      residenceLevel={this.state.residenceLevel}
      workshopLevel={this.state.workshopLevel}
      collectCount={this.state.collectCount}
      streetCulture={this.state.streetCulture}
      race={this.state.race}
      onChapterSelect={this.quickSelect}
      onChange={this.setProp}
      toggleHelp={this.toggleHelp}
    />;
    return <div>
      <div id="leftBar">
        {left}
      </div>
      <div id="mainContentContainer">
        {window}
      </div>
    </div>;
  }

  quickSelect(event) {
    if (!event.target.value) {
      return;
    }
    const chapter = event.target.value ;
    const res = Building("Residence", "Elves");
    for (let i = res.getMaxLevel(); i >= res.getMinLevel(); i--) {
      if (res.getChapter(i) <= chapter) {
        this.setState({residenceLevel: i});
        break;
      }
    }
    const ws = Building("Workshop", "Elves");
    for (let i = ws.getMaxLevel(); i >= ws.getMinLevel(); i--) {
      if (ws.getChapter(i) <= chapter) {
        this.setState({workshopLevel: i});
        break;
      }
    }
    let best = 0;
    for (let streetCulture in Data.Roads) {
      if (Data.Roads[streetCulture].Chapter <= chapter && streetCulture > best) {
        best = streetCulture;
      }
    }
    this.setState({streetCulture: best});
    let cultureDensity = 145;
    switch (parseInt(chapter)) {
      // In most cases, I use an item actually in the last row of techs from
      // the previous age
      case 1:
        cultureDensity = 22; // Luminous Signpost
        break;
      case 2:
        cultureDensity = 28; // Flying Boat (I)
        break;
      case 3:
        cultureDensity = 33; // Spot of Whispering Trees (II)
        break;
      case 4:
        cultureDensity = 49; // Mysterious Cyclone (III)
        break;
      case 5:
        cultureDensity = 60; // Temple of Ages (IV)
        break;
      case 6:
        cultureDensity = 85; // Ancient Grounds (halfway through)
        break;
      case 7:
        cultureDensity = 96; // Temple of the Holy Fire (Dwarves)
        break;
      case 8:
        cultureDensity = 123; // Pond of Recreation (Fairies); Diabhal's is only slightly higher
        break;
      case 9:
        cultureDensity = 145; // Campfire BBQ (Orcs)
        break;
      default:
        cultureDensity = 145;
        break;
    }
    this.setState({cultureDensity: cultureDensity});
  }

  setProp(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  toggleHelp(event) {
    this.setState({showHelp: !this.state.showHelp});
  }
}
ReactDOM.render(<ElvenarCalculator />, document.querySelector("#reactRoot"));
