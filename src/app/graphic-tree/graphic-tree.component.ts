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
  numberOfPositiveRelations = 0;
  numberOfRelationsFinded = 0;
  numberOfExcludedLoops = 0;
  outputTable = [];

  displayNumberOfOccurrences(synsetID, actualWord, sourceID?) {
    // const wordsFindTable = word.split(', ');
    let result = 0;
    // if (source) {
    //   wordsFindTable.forEach(element => {
    //     if (this.listOfFrequencies.find(obj => obj.name === element && obj.name !== source)) {
    //       if (this.listOfFrequencies.find(obj => obj.name === element && obj.name !== source).value > result) {
    //         result = this.listOfFrequencies.find(obj => obj.name === element && obj.name !== source).value;
    //         // console.log(element + ': ' + result);
    //       }
    //     }
    //   });
    //   if (wordsFindTable.includes(source) && result === 0) {
    //     return -1;
    //   } else {
    //     return result;
    //   }
    // } else {
    //   wordsFindTable.forEach(element => {
    //     if (this.listOfFrequencies.find(obj => obj.name === element)) {
    //       if (this.listOfFrequencies.find(obj => obj.name === element).value > result) {
    //         result = this.listOfFrequencies.find(obj => obj.name === element).value;
    //       }
    //     }
    //   });
    //   return result;
    // }
    if (!sourceID) {
      return 999;
    } else {
      if (synsetID === sourceID) {
        return -1;
      } else {
        const formatedWord = actualWord.replace(/\([a-z]*\)/g, '').replace(/\s*\d+\s*/g, '');
          if (this.listOfFrequencies.find(obj => obj.name === formatedWord)) {
            if (this.listOfFrequencies.find(obj => obj.name === formatedWord).value > result) {
              result = this.listOfFrequencies.find(obj => obj.name === formatedWord).value;
            }
          }
        return result;
      }
    }
  }
  ngOnInit() {

    // jezeli istnieje powtorka synsetID w tablicy to lacze te dwie "jednostki" w jedna ale
    // content jest tylko z jednej jednostki zeby nie miec duplikatow
    console.log(this.outputTable);
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

    // this.outputTable = this.allRelationsTable;
    console.log(this.outputTable);
    // this.outputTable.forEach(element => {
    //   element['value'] = this.displayNumberOfOccurrences(element.word); // pierwsze slowo
    //   element.content.forEach(i => {
    //     if (this.displayNumberOfOccurrences(i.synsetName) > 0) {
    //       this.numberOfPositiveRelations ++;
    //       this.numberOfRelationsFinded ++;
    //     } else {
    //       this.numberOfPositiveRelations ++;
    //     } // zlicza ile jest relacji i ile slow ma value > 0
    //     i['value'] = this.displayNumberOfOccurrences(i.synsetName); // drugie slowo
    //     i.content.forEach(y => {
    //       if (this.displayNumberOfOccurrences(y.synsetName, element.word) === -1) {
    //         // jezeli jest -1 to nic nie rob
    //         this.numberOfExcludedLoops ++;
    //       } else {
    //         if (this.displayNumberOfOccurrences(y.synsetName, element.word) > 0) { // slowo znalezione w liscie czestosic
    //           this.numberOfPositiveRelations ++;
    //           this.numberOfRelationsFinded ++;
    //         } else {
    //           this.numberOfPositiveRelations ++; // slowo NIE znalezione w liscie czestosci
    //         }
    //       }
    //       y['value'] = this.displayNumberOfOccurrences(y.synsetName, element.word); // trzecie slowo
    //     });
    //   });
    // });
    this.outputTable.forEach(element => {
      element.word.forEach(word => {
        word.value = this.displayNumberOfOccurrences(element.synsetID, word.word);
      });
      element.content.forEach(i => {
        i.synsetName.forEach(word => {
          word.value = this.displayNumberOfOccurrences(i.synsetID, word.word, element.synsetID);
        });
        i.content.forEach(y => {
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
        if (el.synsetName.some(x => x.value > 0)) {
          this.numberOfPositiveRelations ++;
        }
        el.content.forEach(e => {
          if (e.synsetName.some(x => x.value === -1)) {
            this.numberOfExcludedLoops ++;
          }
          if (e.synsetName.some(x => x.value > 0)) {
            this.numberOfPositiveRelations ++;
          }
        })
      });
    });
  }

}
