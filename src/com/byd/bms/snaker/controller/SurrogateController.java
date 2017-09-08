package com.byd.bms.snaker.controller;

import org.snaker.engine.access.Page;
import org.snaker.engine.access.QueryFilter;
import org.snaker.engine.entity.Surrogate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.byd.bms.snaker.engine.SnakerEngineFacets;

/**
 * 委托授权
 * @author thw
 * @since 0.1
 */
@Controller
@RequestMapping(value = "/snaker/surrogate")
public class SurrogateController {
	@Autowired
	private SnakerEngineFacets facets;
	
	@RequestMapping(value = "list", method = RequestMethod.GET)
	public String list(Model model, Page<Surrogate> page) {
		facets.searchSurrogate(page, new QueryFilter());
		model.addAttribute("page", page);
		return "snaker/surrogateList";
	}
	
	@RequestMapping(value = "create", method = RequestMethod.GET)
	public String create(Model model) {
		model.addAttribute("surrogate", new Surrogate());
		model.addAttribute("processNames", facets.getAllProcessNames());
		return "snaker/surrogateEdit";
	}

	@RequestMapping(value = "update/{id}", method = RequestMethod.GET)
	public String edit(@PathVariable("id") String id, Model model) {
		model.addAttribute("surrogate", facets.getSurrogate(id));
		model.addAttribute("processNames", facets.getAllProcessNames());
		return "snaker/surrogateEdit";
	}
	
	@RequestMapping(value = "view/{id}", method = RequestMethod.GET)
	public String view(@PathVariable("id") String id, Model model) {
		model.addAttribute("surrogate", facets.getSurrogate(id));
		return "snaker/surrogateView";
	}
	
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public String update(Surrogate surrogate) {
		surrogate.setSdate(surrogate.getSdate() + " 00:00:00");
		surrogate.setEdate(surrogate.getEdate() + " 23:59:59");
		facets.addSurrogate(surrogate);
		return "redirect:/snaker/surrogate/list";
	}
	
	@RequestMapping(value = "delete/{id}")
	public String delete(@PathVariable("id") String id) {
		facets.deleteSurrogate(id);
		return "redirect:/snaker/surrogate";
	}
}