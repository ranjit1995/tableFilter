
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { employees } from './data.service';

export interface UserData {
  name: string;
  email: string;
  age: string;
  department: [];
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'test-app';
  displayedColumns: string[] = ['name', 'email', 'age', 'department'];
  dataSource: MatTableDataSource<UserData>;
  employeeData:any=employees
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterForm: FormGroup;
  employeesData:any=employees
  departmentList: any=[];
  constructor(private formBuilder:FormBuilder) {
    this.dataSource = new MatTableDataSource(this.employeeData);
    console.log(this.dataSource.filteredData.length)
  }
  ngOnInit(){
    this.filterForm=this.formBuilder.group({
      department:[''],
      search:['']
    })
    console.log(this.employeesData)
    this.employeesData.forEach(element => {
      element.departments.forEach(elements => {
        let index=this.departmentList.findIndex(x=>x===elements) 
        if(index===-1){
          this.departmentList.push(elements)       
        }
      });
    });
    console.log(this.departmentList)
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  searchData(){
    console.log(this.filterForm.value)
    if(this.filterForm.value.department && !this.filterForm.value.search){
      this.departmentChange(this.filterForm.value.department)
    }
    if(this.filterForm.value.search && !this.filterForm.value.department){
      this.applyFilter(this.filterForm.value.search)
    }
    if(this.filterForm.value.department && this.filterForm.value.search){
      let sortData:any=[]
      let department=this.filterForm.value.department
      let filterValue=this.filterForm.value.search
       this.employeesData.forEach(element => {
        console.log(element.departments)
        element.departments.forEach(elmt=>{
          console.log(elmt,elmt===department)
          if(elmt===department){
            sortData.push(element)
          }
        })
      });
      if(sortData){
        this.dataSource = new MatTableDataSource(sortData);
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }     
    }
  }
  departmentChange(department){
    console.log(department)
    let sortData:any=[]
     this.employeesData.forEach(element => {
      console.log(element.departments)
      element.departments.forEach(elmt=>{
        console.log(elmt,elmt===department)
        if(elmt===department){
          sortData.push(element)
        }
      })
    });
    this.dataSource=sortData
  }
  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  reset(){
    this.filterForm.reset()
    this.dataSource=this.employeesData
  }
}
