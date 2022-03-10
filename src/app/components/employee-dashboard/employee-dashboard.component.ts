import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder} from '@angular/forms';
import { empModel } from '../../models/emp-dashboard.model';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  empData: any = [];
  employeeModel: empModel = new empModel();
  addBtn: boolean = false;
  editBtn: boolean = false;
  // employeeModel: empModel[] = [];
  constructor(private formBuilder : FormBuilder, private api: ApiService) { }


  ngOnInit(): void {
    
    this.getEmpData();

    this.formValue = this.formBuilder.group({
      firstName:[''],
      lastName:[''],
      email:[''],
      mobileNumber:[''],
      salary:[''],
    })

  }

  addEmployee(){
    this.formValue.reset()
    this.addBtn = true;
    this.editBtn = false;
  }

  postData(){
    if(!this.formValue.value.firstName || !this.formValue.value.lastName 
      || !this.formValue.value.email || !this.formValue.value.mobileNumber || !this.formValue.value.salary){
        alert('Enter Mandatory fields !!')
      } else {
        this.employeeModel.firstName = this.formValue.value.firstName;
        this.employeeModel.lastName = this.formValue.value.lastName;
        this.employeeModel.email = this.formValue.value.email;
        this.employeeModel.mobileNumber = this.formValue.value.mobileNumber;
        this.employeeModel.salary = this.formValue.value.salary;

        this.api.postData(this.employeeModel).subscribe(res=>{
          console.log(res,'successfull!')
          alert('Data has been added successfully!');
          this.formValue.reset();
          let ref = document.getElementById('cancel');
          ref?.click();
          this.getEmpData();
        },(err)=>{
          alert('Error adding data !!')
        })
      }
    
  }

  getEmpData(){
    this.api.getEmpData().subscribe(res=>{
      this.empData = res;
      console.log('resp****',res)
    })
  }

  onEdit(item: any){
    this.addBtn = false;
    this.editBtn = true;
    // this.formValue.patchValue(item);
    this.employeeModel.id = item.id;
    this.formValue.controls['firstName'].setValue(item.firstName);
    this.formValue.controls['lastName'].setValue(item.lastName);
    this.formValue.controls['email'].setValue(item.email);
    this.formValue.controls['mobileNumber'].setValue(item.mobileNumber);
    this.formValue.controls['salary'].setValue(item.salary);
  }

  editData(){
    this.employeeModel.firstName = this.formValue.value.firstName;
    this.employeeModel.lastName = this.formValue.value.lastName;
    this.employeeModel.email = this.formValue.value.email;
    this.employeeModel.mobileNumber = this.formValue.value.mobileNumber;
    this.employeeModel.salary = this.formValue.value.salary;
    
    this.api.updateEmp(this.employeeModel, this.employeeModel.id).subscribe(res=>{
      alert('Data updated successfully !!')
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getEmpData();
    }, (err)=>{
      alert(err)
    })
  }
 

  deleteData(id: number){
    this.api.deleteEmp(id).subscribe(res=>{
      alert('data deleted successfully !!')
      this.getEmpData();
    }, (err)=>{
      alert(err)
    })
  }

}
