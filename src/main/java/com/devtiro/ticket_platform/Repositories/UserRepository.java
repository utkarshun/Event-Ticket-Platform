package com.devtiro.ticket_platform.Repositories;


import com.devtiro.ticket_platform.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository

public interface UserRepository extends JpaRepository<User, UUID> {

}
