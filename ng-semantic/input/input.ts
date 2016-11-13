import {
  Component, Input, ChangeDetectionStrategy, Output, ViewContainerRef,
  EventEmitter, OnInit, forwardRef
} from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

const noop = () => {};

// From @angular/material
function coerceBooleanProperty(value: any): boolean {
  return value != null && `${value}` !== 'false';
}

export const SM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SemanticInputComponent),
  multi: true
};


/**
 * Implementation of Input element
 *
 * @link http://semantic-ui.com/elements/input.html
 *
 * @example
 * <sm-input icon="dollar" type="number" [(model)]="model" class="right fluid" placeholder="Enter a sum..."></sm-input>
 */
@Component({
  selector: "sm-input",
  template: `<div class="field" [ngClass]="{error: (!control.valid && (control.dirty || control.touched) && isInsideForm), 'required': required }">
  <label *ngIf="label && isInsideForm">{{label}}</label>
  <div class="ui input {{class}}" [ngClass]="{'icon': icon, 'error': (!control.valid && (control.dirty || control.touched) &&!isInsideForm)}">
  <label *ngIf="label && !isInsideForm" class="ui label">{{label}}</label>
  <input
    [type]="type"
    [(ngModel)]="model"
    [required]="required"
    #input #control="ngModel"
    [placeholder]="placeholder"
    (change)="_handleChange($event)"
    (blur)="_handleBlur($event)"
    >
  <i *ngIf="icon" class="{{icon}} icon"></i>
</div>
</div>`,
  providers: [SM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SemanticInputComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() class: string;
  @Input() icon: string;
  @Input() type: string = "text";
  @Input() placeholder: string;

  private _required: boolean = false;

  @Input()
  get required(): boolean { return this._required; }
  set required(value) {
    this._required = coerceBooleanProperty(value);
  }

  private _model: string|number = '';

  get model(): any {
    return this._model;
  }
  @Input()
  set model(m: any) {
    if (m != this._model) {
      this._model = m;
      this._onChangeCallback(m);
    }
  }

  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_: any) => void = noop;

  private isInsideForm: boolean = false;

  constructor(public viewRef: ViewContainerRef) {}

  ngOnInit() {
    // if input field is inside form
    if (this.inForm(this.viewRef.element.nativeElement, "form")) {
      this.isInsideForm = true;
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string|number) {
    this._model = value;
  }

  registerOnChange(fn: (_: any) => void) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void) {
    this._onTouchedCallback = fn;
  }

  _handleBlur(event: FocusEvent) {
    this._onTouchedCallback();
  }

  _handleChange(event: Event) {
    this.model = (<HTMLInputElement> event.target).value;
    this._onTouchedCallback();
  }

  inForm(el: Node, classname: string): boolean {
    if (el.parentNode) {
      if (el.parentNode.nodeName.toLowerCase() === classname.toLowerCase()) {
        return !!el.parentNode;
      } else {
        return this.inForm(el.parentNode, classname);
      }
    } else {
      return false;
    }
  }
}

/**
 * Implementation of Checkbox element
 *
 * @link http://semantic-ui.com/modules/checkbox.html
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "sm-checkbox",
  template: `<div class="field" [ngClass]="{error: (!control.value && control?.validator) }">
    <div class="ui {{classType}} checkbox">
      <input type="checkbox"
      [attr.value]="value"
      [attr.type]="inputType" tabindex="0" [attr.name]="name" [formControl]="control" [attr.disabled]="disabled">
      <label *ngIf="label">{{label}}</label>
    </div>
  </div>`
})
export class SemanticCheckboxComponent {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() disabled: boolean;
  @Input() value: string|number;
  @Input() name: string;
  @Input("type")
  set type(data: string) {
    if (data && data !== "checkbox") {
      this.classType = data;
      if (data === "radio") {
        this.inputType = data;
      }
    }
  }
  private inputType: string = "checkbox";
  private classType = "checkbox";
}

/**
 * Implementation of Textarea element
 *
 * @link http://semantic-ui.com/collections/form.html#text-area
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "sm-textarea",
  template: `<div class="field" [ngClass]="{error: (!control.valid && control.dirty) }">
    <label *ngIf="label">{{label}}</label>
    <textarea rows="{{rows}}" [formControl]="control"></textarea>
  </div>`
})
export class SemanticTextareaComponent {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() rows: string;
}
