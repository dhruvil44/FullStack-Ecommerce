package com.luv2code.ecommerce.config;


import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //protect the endpoint /api/orders
        http.authorizeRequests()
                .antMatchers("/api/orders/**")
                .authenticated()
                .and()
                .oauth2ResourceServer()
                .jwt();

        //add CORS filter
        http.cors();

        //force a non-empty response body for 401 to make the response more friendly
        Okta.configureResourceServer401ResponseBody(http);

        //disable csrf since we are not using Cookies for session tracking
        http.csrf().disable();
    }
}
