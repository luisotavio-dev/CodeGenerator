const JavaRepositoryTemplate = 
`package com.luisot.codegen.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.luisot.codegen.model.{{className}};

public interface {{className}}Repository extends JpaRepository<{{className}}, Integer> {

}
`;

exports.JavaRepositoryTemplate = JavaRepositoryTemplate;