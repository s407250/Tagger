import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/test.service';
import { PlWordnetService } from '../services/plwordnet.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private testService: TestService, private plWordnetService: PlWordnetService) { }
  final = [];
  logOnClick(value) {
    this.oneBigFunction(value);
 }

oneBigFunction(word) {
  this.testService.getSense(word).subscribe(
    sensesTable => {
      sensesTable.forEach(element => {
        this.testService.getSynsetBySenseID(element.senseID).subscribe(synset => {
          element.synsetID = synset;
          this.testService.getRelationsFromSynset(element.synsetID).subscribe(
            relations => {
              element.content = relations;
              element.content.forEach(item => {
                this.testService.getUnitStringSynset(item.synsetID).subscribe(
                  unitString => {
                    item.synsetName = unitString;
                    this.testService.getRelationsFromSynset(item.synsetID).subscribe(
                      relations2 => {
                        item.content = relations2;
                        item.content.forEach(item2 => {
                          this.testService.getUnitStringSynset(item2.synsetID).subscribe(
                            unitString2 => {
                              item2.synsetName = unitString2;
                            }
                          );
                        });
                      }
                    );
                  }
                );
              });
            }
          );
        });
      });
      this.final = sensesTable;
    }
  );
}

  ngOnInit() {
    //this.testService.getUnitStringSynset(23).subscribe(res => this.final = res);
    //this.oneBigFunction('lew');
  }

}
