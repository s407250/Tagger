import { Component, OnInit, Input } from '@angular/core';
import { Relation } from '../models/relation.interface';

@Component({
  selector: 'app-graphic-tree',
  templateUrl: './graphic-tree.component.html',
  styleUrls: ['./graphic-tree.component.css']
})



export class GraphicTreeComponent implements OnInit {
  @Input() listOfTags;
  @Input() listOfFrequencies;
  @Input() allRelationsTable;
  @Input() searchTags;
  @Input() foundTags;
  constructor() { }
  numberOfPositiveRelations = 0;
  numberOfRelationsFinded = 0;
  numberOfExcludedLoops = 0;
  outputTable = [];

  excludeLoops(array, condition) {
    const out = array.filter(item => item.synsetName[0].value !== condition);
    return out;
  }
  displayNumberOfOccurrences(synsetID, actualWord, sourceID?) {

    // slowo sprowadzam do malych liter bo w liscie czestosci oraz tagow sa z malych liter
    const formatedWord = actualWord.replace(/\([a-z]*\)/g, '').replace(/\s*\d+\s*/g, '').toLowerCase();
    let result = 0;
    if (!sourceID) {
      if (this.listOfTags.find(obj => obj.name === formatedWord)) {
        result = this.listOfTags.find(obj => obj.name === formatedWord).value;
      }
    } else {
      if (synsetID === sourceID) {
        result = -1;
      } else {
          if (this.listOfFrequencies.find(obj => obj.name === formatedWord)) {
            if (this.listOfFrequencies.find(obj => obj.name === formatedWord).value === 'tag'
            || this.listOfFrequencies.find(obj => obj.name === formatedWord).value > result) {
              result = this.listOfFrequencies.find(obj => obj.name === formatedWord).value;
            }
          }
      }
    }
    return result;
  }
  ngOnInit() {

    // jezeli istnieje powtorka synsetID w tablicy to lacze te dwie "jednostki" w jedna ale
    // content jest tylko z jednej jednostki zeby nie miec duplikatow
    this.outputTable = this.allRelationsTable.reduce((prev, curr) => {
      const element = prev.find(item => item.synsetID === curr.synsetID);
      const index = prev.indexOf(element);
      // console.log({prev, curr, index, element});
      if (index !== -1) {
        console.log('lacze');
        prev[index].content = [...element.content];
        return prev;
      } else {
        return [...prev, curr];
      }
    }, []);

    this.outputTable.forEach(element => {
      element.word.forEach(word => {
        word.value = this.displayNumberOfOccurrences(element.synsetID, word.word);
      });
      element.content.forEach(i => {
        i.synsetName.forEach(word => {
          word.value = this.displayNumberOfOccurrences(i.synsetID, word.word, element.synsetID);
        });
        i.content.forEach((y, index, array) => {
          y.synsetName.forEach(word => {
            word.value = this.displayNumberOfOccurrences(y.synsetID, word.word, element.synsetID);
          });
        });
      });
    });

    this.outputTable.forEach(element => {
      this.numberOfRelationsFinded += element.content.length;
      element.content.forEach(el => {
        this.numberOfRelationsFinded += el.content.length;
        if (el.synsetName.some(x => x.value === -1)) {
          this.numberOfExcludedLoops ++;
        }
        if (el.synsetName.some(x => x.value !== 0 && x.value !==-1)) {
          this.numberOfPositiveRelations ++;
        }
        el.content.forEach(e => {
          if (e.synsetName.some(x => x.value === -1)) {
            this.numberOfExcludedLoops ++;
          }
          if (e.synsetName.some(x => x.value !== 0 && x.value !==-1)) {
            this.numberOfPositiveRelations ++;
          }
        });
      });
    });
    console.log(this.outputTable);
  }

}
