import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { JhiLanguageService } from 'ng-jhipster';

import { RegisterService } from 'app/account/register/register.service';
import { User } from 'app/core/user/user.model';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared/constants/error.constants';
import { ProfileService } from 'app/shared/layouts/profiles/profile.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'jhi-register',
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, AfterViewInit {
    @ViewChild('login', { static: false })
    login?: ElementRef;

    doNotMatch = false;
    error = false;
    errorEmailExists = false;
    errorUserExists = false;
    success = false;

    usernamePattern = '^[a-zA-Z0-9]*';

    registerForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        login: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(this.usernamePattern)]],
        email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    });
    isRegistrationEnabled = false;
    allowedEmailPattern?: string;
    allowedEmailPatternReadable?: string;

    constructor(private languageService: JhiLanguageService, private registerService: RegisterService, private fb: FormBuilder, private profileService: ProfileService) {}

    ngAfterViewInit(): void {
        if (this.login) {
            this.login.nativeElement.focus();
        }
    }

    // TEST CODE BEGIN
    // updateAllowedEmailPattern() {
    //     if (this.allowedEmailPattern) {
    //         this.registerForm.get('email')!
    //         .setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(100), Validators.pattern(this.allowedEmailPattern)]);
    //     }
    // }
    // TEST CODE END

    ngOnInit() {
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            if (profileInfo) {
                this.isRegistrationEnabled = profileInfo.registrationEnabled || false;
                this.allowedEmailPattern = profileInfo.allowedEmailPattern;
                this.allowedEmailPatternReadable = profileInfo.allowedEmailPatternReadable;
                if (this.allowedEmailPattern) {
                    const jsRegexPattern = this.allowedEmailPattern;
                    this.registerForm.get('email')!.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(100), Validators.pattern(jsRegexPattern)]);
                }
            }
        });
    }

    /**
     * Registers a new user in Artemis. This is only possible if the passwords match and there is no user with the same
     * e-mail or username. For the language the current browser language is selected.
     */
    register(): void {
        this.doNotMatch = false;
        this.error = false;
        this.errorEmailExists = false;
        this.errorUserExists = false;

        const password = this.registerForm.get(['password'])!.value;
        if (password !== this.registerForm.get(['confirmPassword'])!.value) {
            this.doNotMatch = true;
        } else {
            const user = new User();
            user.firstName = this.registerForm.get(['firstName'])!.value;
            user.lastName = this.registerForm.get(['lastName'])!.value;
            user.login = this.registerForm.get(['login'])!.value;
            user.email = this.registerForm.get(['email'])!.value;
            user.password = password;
            user.langKey = this.languageService.getCurrentLanguage();
            this.registerService.save(user).subscribe(
                () => (this.success = true),
                (response) => this.processError(response),
            );
        }
    }

    private processError(response: HttpErrorResponse): void {
        if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
            this.errorUserExists = true;
        } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
            this.errorEmailExists = true;
        } else {
            this.error = true;
        }
    }
}
