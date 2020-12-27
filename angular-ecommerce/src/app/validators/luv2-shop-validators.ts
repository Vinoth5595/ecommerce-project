import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {
    // white space validation
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

        // check if string only has whitespace
        if(control.value!=null && control.value.trim().length === 0){
            return {'notOnlyWhiteSpace': true};
        }

        return null;
    }
}
