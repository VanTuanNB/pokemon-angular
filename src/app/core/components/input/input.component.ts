import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
})
export class InputComponent {
    @Input() placeholder: string = '';

    public value: string = '';

    writeValue(value: string): void {
        this.value = value || '';
    }

    public propagateOnChange = (value: any) => {};
    public propagateTouched = () => {};

    registerOnChange(fn: any) {
        this.propagateOnChange = fn;
    }

    registerOnTouched(fn: any) {
        this.propagateTouched = fn;
    }

    public onChangeInput() {
        this.propagateOnChange(this.value);
        this.propagateTouched();
    }
}
