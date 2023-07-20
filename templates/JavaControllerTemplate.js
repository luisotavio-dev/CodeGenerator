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
    public List<{{className}}> consultarTodos() {
        return service.consultarTodos();
    }

    @GetMapping("/{id}")
    public {{className}} consultarPorId(@PathVariable Integer id) {
        try {
    		return service.consultarEspecífico(id).get();
		} catch (Exception e) {
			throw new NotFoundException("Nenhum registro encontrado com o id " + id);
		}
    }

    @PostMapping
    public {{className}} inserir(@RequestBody {{className}} object) {
        return service.salvar(object);
    }

    @PutMapping
    public {{className}} editar(@RequestBody {{className}} object) {
    	return service.salvar(object);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {
        try {
            service.excluir(id);
        } catch (Exception e) {
            throw Exceptions.generateGenericException(e);
        }
    }
}
`;

exports.JavaControllerTemplate = JavaControllerTemplate;