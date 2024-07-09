import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteModalComponent } from '../../../src/app/features/product-delete/delete-modal/delete-modal.component';
import { EventEmitter } from '@angular/core';
import { ProductItem } from 'src/app/core/models/product.model';

describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;
  let deleteConfirmedSpy: jest.SpyInstance;
  let cancelClickedSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Spies for output events
    deleteConfirmedSpy = jest.spyOn(component.deleteConfirmed, 'emit');
    cancelClickedSpy = jest.spyOn(component.cancelClicked, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancelClicked event when cancelDelete is called', () => {
    component.cancelDelete();
    expect(cancelClickedSpy).toHaveBeenCalled();
  });

  it('should emit deleteConfirmed event with true when deleteProduct is called', () => {
    component.confirmDelete();
    expect(deleteConfirmedSpy).toHaveBeenCalledWith(true);
  });

  // Additional tests can be added to test other scenarios, like checking initial values of inputs, etc.
});
