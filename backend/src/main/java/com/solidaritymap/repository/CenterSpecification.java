package com.solidaritymap.repository;

import com.solidaritymap.model.Center;
import com.solidaritymap.model.CenterType;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class CenterSpecification {

    public static Specification<Center> getSpecifications(String search, CenterType type, Integer urgencyStatus) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String likeSearch = "%" + search.toLowerCase() + "%";
                Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likeSearch);
                Predicate addressLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), likeSearch);
                predicates.add(criteriaBuilder.or(nameLike, addressLike));
            }

            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }

            if (urgencyStatus != null) {
                predicates.add(criteriaBuilder.equal(root.get("urgencyStatus"), urgencyStatus));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
