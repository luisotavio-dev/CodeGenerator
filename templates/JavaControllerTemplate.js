const JavaControllerTemplate = 
`package com.luisot.codegen.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luisot.codegen.model.{{className}};
import com.luisot.codegen.service.{{className}}Service;
import com.luisot.codegen.util.Exceptions;
import com.luisot.codegen.util.exceptions.NotFoundException;

import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(value = "/{{tableName}}", produces = "application/json;charset=UTF-8")
@AllArgsConstructor
public class {{className}}Controller {
    @Autowired
    private {{className}}Service service;

    @GetMapping
    public List<{{className}}> getAll() {
        try {
            return service.getAll();
        } catch (Exception e) {
            throw Exceptions.generateGenericException(e);
        }
    }

    @GetMapping("/{id}")
    public {{className}} getById(@PathVariable Integer id) {
        Optional<{{className}}> object = service.getOne(id);

        if (object.isPresent()) {
            return object.get();
        } else {
            throw new NotFoundException("{{className}} " + id + " não encontrado.");
        }
    }

    @PostMapping
    public {{className}} save(@RequestBody {{className}} object) {
        try {
            return service.save(object);
        } catch (Exception e) {
            throw Exceptions.generateGenericException(e);
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        try {
            service.delete(id);
        } catch (Exception e) {
            throw Exceptions.generateGenericException(e);
        }
    }
}
`;

exports.JavaControllerTemplate = JavaControllerTemplate;