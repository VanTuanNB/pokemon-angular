import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-input-range',
    templateUrl: './input-range.component.html',
    styleUrl: './input-range.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputRangeComponent),
            multi: true,
        },
    ],
})
export class InputRangeComponent {
    @Input() placeholders: [string, string] = ['', ''];
    @Input() type: 'text' | 'number' = 'number';
    @Input() min: number = 0;
    @Input() max: number = 99999;
    @Input() disabled: boolean = false;
    public firstInputValue: string | number | null = null;
    public lastInputValue: string | number | null = null;
    constructor() {}

    writeValue(value: [string | number, string | number]): void {
        if (!Array.isArray(value)) return;
        this.firstInputValue = value[0];
        this.lastInputValue = value[1];
    }

    public propagateOnChange = (value: any) => {};
    public propagateTouched = () => {};

    registerOnChange(fn: any) {
        this.propagateOnChange = fn;
    }

    registerOnTouched(fn: any) {
        this.propagateTouched = fn;
    }

    public onFirstInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const valueNumber = +input.value;
        if (this.firstInputValue === 0 && valueNumber === 0) {
            this.firstInputValue = null;
            this.lastInputValue = null;
            input.value = null as any;
            this.emitChange();
            return;
        }

        if (valueNumber >= Number(this.lastInputValue) && this.lastInputValue) {
            input.value = `${Number(this.lastInputValue) - 1}`;
        } else if (valueNumber > this.min) {
            input.value = `${valueNumber}`;
        } else {
            input.value = `${this.min}`;
        }
        this.firstInputValue = +input.value;
        this.emitChange();
    }

    public onLastInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const valueNumber = +input.value;
        if (this.lastInputValue === 0 && valueNumber === 0) {
            this.lastInputValue = null;
            this.firstInputValue = null;
            input.value = null as any;
            this.emitChange();
            return;
        }
        if (valueNumber >= this.max) {
            input.value = `${this.max}`;
        }
        // else if (valueNumber <= this.max && this.firstInputValue && valueNumber <= Number(this.firstInputValue)) {
        //     this.firstInputValue = valueNumber - 1;
        // }
        else {
            input.value = `${valueNumber}`;
        }
        this.lastInputValue = +input.value;
        this.emitChange();
    }

    public emitChange() {
        this.propagateOnChange([this.firstInputValue, this.lastInputValue]);
        this.propagateTouched();
    }
}
