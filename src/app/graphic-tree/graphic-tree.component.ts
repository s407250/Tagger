import { Component, OnInit, Input } from '@angular/core';
import { Relation } from '../models/relation.interface';

@Component({
  selector: 'app-graphic-tree',
  templateUrl: './graphic-tree.component.html',
  styleUrls: ['./graphic-tree.component.css']
})



export class GraphicTreeComponent implements OnInit {
  @Input() listOfFrequencies;
  @Input() allRelationsTable;
  constructor() { }
  numberOfRelations = 0;
  numberOfRelationsFinded = 0;
  outputTable = [];

  displayNumberOfOccurrences(word) {
    const wordsFindTable = word.split(', ');
    // console.log(wordsFindTable);
    let result = 0;
    wordsFindTable.forEach(element => {
      if (this.listOfFrequencies.find(obj => obj.name === element)) {
        if (this.listOfFrequencies.find(obj => obj.name === element).value > result) {
          result = this.listOfFrequencies.find(obj => obj.name === element).value;
        }
      }
    });
    return result;
  }
  ngOnInit() {
    this.outputTable = this.allRelationsTable.reduce((prev, curr) => { // laczy relacje do tego samego slowa w jedna tablice
      const element = prev.find(item => item.word === curr.word);
      const index = prev.indexOf(element);
      // console.log({prev, curr, index, element});
      if (index !== -1) {
        prev[index].content = [...element.content, ...curr.content];
        return prev;
      } else {
        return [...prev, curr];
      }
    }, []);

    this.outputTable.forEach(element => {
      element['value'] = this.displayNumberOfOccurrences(element.word);
      element.content.forEach(i => {
        if (this.displayNumberOfOccurrences(i.synsetName) > 0) {
          this.numberOfRelations ++;
          this.numberOfRelationsFinded ++;
        } else {
          this.numberOfRelations ++;
        } // zlicza ile jest relacji i ile slow ma value > 0
        i['value'] = this.displayNumberOfOccurrences(i.synsetName);
        i.content.forEach(y => {
          if (this.displayNumberOfOccurrences(y.synsetName) > 0) {
            this.numberOfRelations ++;
            this.numberOfRelationsFinded ++;
          } else {
            this.numberOfRelations ++;
          } // zlicza ile jest relacji i ile slow ma value > 0 w kolejnym zagniezdzeniu
          y['value'] = this.displayNumberOfOccurrences(y.synsetName); // podpisuje wartosc wystapien slowa do value
        });
      });
    });
    // console.log(this.outputTable);
  }

}
