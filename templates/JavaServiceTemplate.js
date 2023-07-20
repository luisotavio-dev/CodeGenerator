const JavaServiceTemplate = 
`package com.luisot.codegen.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.luisot.codegen.model.{{className}};
import com.luisot.codegen.repository.{{className}}Repository;

@Service
public class {{className}}Service {
    @Autowired
    private {{className}}Repository repository;

    public List<{{className}}> consultarTodos() {
        return repository.findAll();
    }

    public Optional<{{className}}> consultarEspecifico(Integer id) {
        return repository.findById(id);
    }

    public {{className}} salvar({{className}} object) {
        return repository.save(object);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
`;

exports.JavaServiceTemplate = JavaServiceTemplate;