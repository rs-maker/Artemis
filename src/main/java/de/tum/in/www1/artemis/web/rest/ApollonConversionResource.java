package de.tum.in.www1.artemis.web.rest;

import java.io.InputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import de.tum.in.www1.artemis.service.connectors.apollon.ApollonConversionService;
import de.tum.in.www1.artemis.web.rest.dto.ApollonConversionDTO;

/**
 * REST controller for managing ApollonDiagram.
 */
@RestController
@RequestMapping("/api")
@Profile("apollon")
public class ApollonConversionResource {

    private final Logger log = LoggerFactory.getLogger(ApollonConversionResource.class);

    private final ApollonConversionService apollonConversionService;

    public ApollonConversionResource(ApollonConversionService apollonConversionService) {
        this.apollonConversionService = apollonConversionService;
    }

    /**
     * Converts given model to pdf
     * @param dto the data transfer object that includes the model for conversion
     * @return input stream for conversion
     */
    @PostMapping("/apollon-convert/pdf")
    @PreAuthorize("hasAnyRole('TA', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity convertApollonDiagram(@RequestBody ApollonConversionDTO dto) {
        log.debug("REST call to convert apollon model to pdf");

        // The apollonConversionService will manage the processing and database saving
        InputStream inputStream = apollonConversionService.convertDiagram(dto.getModel());
        if (inputStream == null) {
            throw new RuntimeException();
        }

        InputStreamResource inputStreamResource = new InputStreamResource(inputStream);
        log.debug("REST call for apollon model conversion to pdf finished");

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "application/pdf").body(inputStreamResource);

    }
}
