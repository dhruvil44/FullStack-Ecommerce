import { FormControl, ValidationErrors } from '@angular/forms';

export class Luv2ShopValidators {

    //whitespace validation
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

        if((control.value!=null) && (control.value.trim().length==0))
        {
            //invalid....return the error object
            return { 'notOnlyWhiteSpace':true };
        }
        else{
            //valid then return null
            return null;
        }
    }
}
