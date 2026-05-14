package symbiosisProject.AgriTrack.configuration;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // IMPORTANT: Enable CORS
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors().and()          // enable CORS
            .csrf().disable()     // disable CSRF for API
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()   // allow all requests
            );

        return http.build();
    }
}